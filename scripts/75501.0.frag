// Author @vladmdgolam
// https://vladmdgolam.me

#ifdef GL_ES
precision mediump float;
#endif

uniform vec2 resolution;
uniform vec2 mouse;
uniform float time;

// скорость движения круга
float speed = 10.;

float circle(in vec2 _st, in float _radius){
    vec2 minus = vec2(0.5);
    float aspect = resolution.y/resolution.x; 
    minus.x /= aspect;
    vec2 dist = _st - minus;
    
    float variable = 1.;
    variable = sin(time*speed);
    
    dist.x += variable * (0.5 - _radius * 3.)/aspect;
    
	return 1.-smoothstep(_radius-(_radius*0.001),
                         _radius+(_radius*0.001),
                         dot(dist,dist)*4.0);
}

void main(){
	vec2 st = gl_FragCoord.xy/resolution.xy;
	st.x /= resolution.y/resolution.x;

	vec3 color = vec3(circle(st,0.01));

	gl_FragColor = vec4( color, 1.0 );
}
