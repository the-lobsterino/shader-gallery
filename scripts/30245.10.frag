
#ifdef GL_ES
precision mediump float;
#endif

uniform vec2 resolution;
uniform vec2 mouse;
uniform float time;

vec3 hsb2rgb( in vec3 c ){
    vec3 rgb = clamp(abs(mod(c.x*6.0+vec3(0.0,4.0,2.0),
                             6.0)-3.0)-1.0, 
                     0.0, 
                     1.0 );
    rgb = rgb*rgb*(3.0-2.0*rgb);
    return c.z * mix( vec3(1.0), rgb, c.y);
}

float centerPoint() {
	float center = .5;
	center = sin(time *  2.0) * 0.5 + 0.5 + cos(time * 4.0);
	center = clamp(center, 0.3, 1.0);
	return center;
}

float circleWhite(float pct) {
	pct = 1.0 - pct;
        float xx = (sin(time * 2.0) + 1.0) * 0.3 + 0.2;
        pct = smoothstep(xx, xx + 0.005, pct);
	return pct;
}

float circleBlack(float pct, float radius) {
	
	float xx = 1.0 - radius;
	pct = smoothstep(xx, xx + 0.005, pct);
	return pct;
}

void main(){
	vec2 st = gl_FragCoord.xy/resolution;
    float pct = 0.0;

    float center = .5;
    center = centerPoint();
    pct = distance(st, vec2(center));
//	pct = distance(st,vec2(0.4)) + distance(st,vec2(0.6));
//	pct = distance(st,vec2(0.4)) * distance(st,vec2(0.6));
	pct = min(distance(st,vec2(center -0.2)),distance(st,vec2(center + sin(time) * 0.2)));
//	pct = max(distance(st,vec2(0.4)),distance(st,vec2(0.6)));
//	pct = pow(distance(st,vec2(0.4)),distance(st,vec2(0.6)));
	pct = pow(distance(st,vec2(center -.1)),distance(st,vec2(center + .1)));
	
    if (cos(time * 4.0) > .0) {
	float radius = (sin(time * 2.0) + 1.0) * 0.3 + 0.2;
        pct = circleBlack(pct, radius);
    } else {
        pct = circleWhite(pct);
    }

	vec3 color = vec3(pct * sin(time) * 0.5 + 0.5, 0.0, .0);
	
	pct = pct * fract(time * 4.0)  + 0.5;
	color = hsb2rgb(vec3(pct));
	gl_FragColor = vec4( color, 1.0 );
}