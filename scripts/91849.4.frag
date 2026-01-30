#extension GL_OES_standard_derivatives : enable

precision highp float;

uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;

float BOX_WIDTH = 900.;
float BOX_HEIGHT = 300.;

float MAX_HEIGHT = 230.;
float RADIUS = 40.;

float sdParallelogram( in vec2 position, float width, float height, float skew)
{
    vec2 e = vec2(skew,height);
    position = (position.y<0.0)?-position:position;
    vec2  w = position - e; w.x -= clamp(w.x,-width,width);
    vec2  d = vec2(dot(w,w), -w.y);
    float s = position.x*e.y - position.y*e.x;
    position = (s<0.0)?-position:position;
    vec2  v = position - vec2(width,0); v -= e*clamp(dot(v,e)/dot(e,e),-1.0,1.0);
    d = min( d, vec2(dot(v,v), width*height-abs(s)));
    return sqrt(d.x)*sign(-d.y);
}

float shadow (in vec2 coords, float height, float skew, float y, float yGradientStart, float yGradientEnd) {
	
	float radius = 40.;
	float width = BOX_WIDTH;

	coords.y += y;
	
	float trapezeShape = 1. - step(0., sdParallelogram(coords.xy, width, height, skew) - radius);	
	
	float totalHeight =  height + 2. * radius;
	
	float edge1 = totalHeight / -2. - yGradientEnd;
	float edge2 = totalHeight / 2. - yGradientStart;
	
	float gradient = smoothstep(edge1, edge2, coords.y);

	return trapezeShape * gradient;
}

void main( void ) {
	
	vec2 coords = gl_FragCoord.xy;

	coords -= vec2(0., MAX_HEIGHT);

	float penumbraAlpha = shadow(coords, MAX_HEIGHT - 2. * RADIUS, -20., 0., 10., MAX_HEIGHT + 10.) * 0.7;
	float antumbraAlpha = shadow(coords, 25., -25., 10., 0., 1.) * 0.35;
	float umbraAlpha = shadow(coords, 30., -30., 0., 0., 1.);
	
	vec4 penumbraColor = vec4(vec3(0.), penumbraAlpha);
	
	vec4 antumbraColor = vec4(vec3(0.), antumbraAlpha);
	
	vec4 umbraColor = vec4(vec3(0.), umbraAlpha);
	
	gl_FragColor = vec4(vec3(0.), penumbraAlpha);

	// gl_FragColor = vec4(vec3(0.), antumbraAlpha);

	// gl_FragColor = vec4(vec3(.0), penumbraAlpha + umbraAlpha + antumbraAlpha);	
	//gl_FragColor = layer(layer(penumbraColor, umbraColor), antumbraColor);

}