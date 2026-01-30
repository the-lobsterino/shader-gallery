// 130620N (Necip's modifications)

#ifdef GL_ES
precision mediump float;
#endif

#extension GL_OES_standard_derivatives : enable

uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;

float plot(vec2 st, float pct){
  return  smoothstep( pct-1.2, pct, st.y) -
          smoothstep( pct, pct+1.2, st.y);
}

vec4 render( vec2 st, float _f) {
	// -1 - 1に正規化.
	

	float r = length(st);
	float a = atan(st.y, st.x);
	float f = sin(a * _f + time);
	
	vec3 color = vec3(1.3 - smoothstep(f, f+1.01, r));

	return vec4(vec3(1.3) * plot(vec2(a, r), f), 1.0 );

}


void main( void ) {
	vec2 st = (gl_FragCoord.xy *3.0 - resolution.xy) / min(resolution.x, resolution.y);
	gl_FragColor = vec4(.3); // render(st, 3.);
	
	
	for(float i=.3;i<=1.0;i+=1.0) {
		if (i==0.0)
			continue;
		gl_FragColor += render(st, i);
	}
}