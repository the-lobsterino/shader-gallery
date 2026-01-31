#ifdef GL_ES
precision mediump float;
#endif

uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;




/*
float coneY(vec3 p, float r, float c)
{	
	return max(abs(p.y)-c,length(p.xz)-r+abs(p.y)/c);
}

float sphere(vec3 p, float r)
{
        return length(p) - r;	
}*/

float rectangle(vec2 samplePosition, vec2 halfSize){
    vec2 componentWiseEdgeDistance = abs(samplePosition) - halfSize;
    float outsideDistance = length(max(componentWiseEdgeDistance, 0.0));
    float insideDistance = min(max(componentWiseEdgeDistance.x, componentWiseEdgeDistance.y), 0.0);
    return outsideDistance + insideDistance;
}

float f(vec2 p)
{
	/*
	const float PI = 3.1415;
	float n = 4.0;
	float a = atan(p.y, p.x);
	float r = cos(PI/n) / cos( mod(a, 2.0*PI/n) - PI/n);
	return length(p.xy) - r*0.05;*/
	
	return rectangle(p, vec2(0.1)) - 0.1;
	//return min(sphere(p, 0.2), sphere(p+vec3(0.25, 0.25, 0.0),  0.1));
	//return coneY(p, 0.15, 0.9);
}



vec2 grad(vec2 p )
{
    vec2 h = vec2( 0.01, 0.0 );
    return vec2( f(p+h.xy) - f(p-h.xy),
                 f(p+h.yx) - f(p-h.yx) )/(2.0*h.x);
}

float f2( vec2 x )
{
    float v = f( x );
    vec2  g = grad( x );
    float de = abs(v)/length(g);
    return de;
}


void main( void ) {
	
	vec2 aspect = vec2(1.0, resolution.y/resolution.x);
	vec2 position = (gl_FragCoord.xy/resolution - 0.5) * aspect;
	vec2 mousepos = (mouse - 0.5) * aspect;
	
	vec3 color = vec3(0.0);		
	
	color += abs(f(position)) < 0.001 ? 1.0 : 0.0;
	color += abs(length(position - mousepos) - abs(f(mousepos))) < 0.001 ? 1.0 : 0.0;
	color = length(position - mousepos) < 0.005 ? vec3(1.0, 0.0, 0.0) :color;
		
			
	gl_FragColor = vec4( color, 1.0 );

}

