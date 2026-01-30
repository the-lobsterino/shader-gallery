// Author @patriciogv - 2015

#ifdef GL_ES
precision mediump float;
#endif

uniform vec2 resolution;
uniform float time;

float circle(in vec2 _st, in float _radius){
    vec2 l = _st-vec2(0.5);
    return 1.-smoothstep(_radius-(_radius*0.01),
                         _radius+(_radius*0.01),
                         dot(l,l)*4.0);
}

float flower(in vec2 p,in float radius){
float u = abs(sin((atan(p.y, p.x) + time * 0.5) * 20.0)) * 0.5;
float t = 0.01 / abs(0.5 + u/30.- length(p));
    return t;
}
float circle2(in vec2 p){
	
float t = 0.02 / abs(0.3 - length(p));
	float t2 = 0.01 / abs(0.45 - length(p))*2.;
	return t+t2;
}

float cross(in vec2 _st, float _size){
    return  flower(_st,.1) + circle2(_st) ;
}

void main() {
	vec2 st = gl_FragCoord.xy/resolution;
        vec2 p = (gl_FragCoord.xy * 2.0 - resolution) / min(resolution.x, resolution.y);
    
    vec3 color = vec3(0.0);
	    vec3 color2 = vec3(0.0);
	    vec3 color3 = vec3(0.0);

    st *= 6.0;     
vec2 translate = vec2(0,0);
    st += translate*1.0;
	// Scale up the space by 3
    st = fract(st); // Wrap arround 1.0



    // Now we have 3 spaces that goes from 0-1

//    color = vec3(st,0.0);
    color = vec3(cross(st-.5,.1));
	color.r = cross(st-.5,.1);
	color.b = cross(st-.5,.1);
	color.g = cross(st-.5,.1);
	gl_FragColor = vec4(vec3(step(color.r,1.2-step(abs(tan(time)),1.)),step(color.g,1.5-step(abs(tan(time)),.1)),step(color.g,1.5-step(abs(tan(time)),3.))),1.0);
}
