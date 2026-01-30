#extension GL_OES_standard_derivatives : enable

precision highp float;

uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;


        float plot(vec2 st) {    
        return smoothstep(0.02, 0.0, abs(st.y - st.x));
         }

        float line(vec2 st){
	//vec3 hc=vec3(0.5,0.5,0.5);
		return 1, 0.0, abs(st.x);
	}

void main( void ) {

	vec2 st = ( gl_FragCoord.xy / resolution.xy );

	float color = 0.5;
	
        
        
	float l=line(st);
	vec3 hc=vec3(1,1,1)*l;
	//gl_FragColor = vec4( vec3( position,color), 1.0 );
	gl_FragColor=vec4(hc,1);

}