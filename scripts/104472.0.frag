#extension GL_OES_standard_derivatives : enable

precision highp float;

uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;

float meraf(vec2 st,float mf){
	
  // return smoothstep(0.01,0.0,abs(st.x-st.y))-smoothstep(0.0,0.0,0.0);
	  return  smoothstep( mf-0.01, mf, st.y) -
          smoothstep( mf, mf+0.0, st.y);
}

void main( ) {
	vec2 st=gl_FragCoord.xy/resolution;
        float y=st.x;
	 float x = smoothstep(0.1,0.9,st.x);
	
	vec3 three=vec3(y);
	float mf=meraf(st,x);
	three=(1.0-mf)*three+mf*vec3(1,0,0);
        gl_FragColor=vec4(three,1);
}