#ifdef GL_ES
precision mediump float;
#endif

#extension GL_OES_standard_derivatives : enable

uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;

const float pi = 3.1415926535897932384626433832795;
const float tau =  6.2831853071795864769252867665590;

//	Uses SDF functions to morph between shapes and sizes
//	By D. Lublin

float circleSDF(vec2 st) {
    return length(st-.5)*2.;
}

float starSDF(vec2 st, int V, float s) {
    st = st*4.-2.;
    float a = atan(st.y, st.x)/tau;
    float seg = a * float(V);
    a = ((floor(seg) + 0.5)/float(V) + 
        mix(s,-s,step(.5,fract(seg)))) 
        * tau;
    return abs(dot(vec2(cos(a),sin(a)),
                   st));
}

void main( void ) {
	/*
	vec2 position = ( gl_FragCoord.xy / resolution.xy ) + mouse / 4.0;

	float color = 0.0;
	color += sin( position.x * cos( time / 15.0 ) * 80.0 ) + cos( position.y * cos( time / 15.0 ) * 10.0 );
	color += sin( position.y * sin( time / 10.0 ) * 40.0 ) + cos( position.x * sin( time / 25.0 ) * 40.0 );
	color += sin( position.x * sin( time / 5.0 ) * 10.0 ) + sin( position.y * sin( time / 35.0 ) * 80.0 );
	color *= sin( time / 10.0 ) * 0.5;

	gl_FragColor = vec4( vec3( color, color * 0.5, sin( color + time / 3.0 ) * 0.75 ), 1.0 );
	*/
	vec2		st = ( gl_FragCoord.xy / resolution.xy );
	float		shapeSize = (1.0 + sin( 0.0 / 10.0 )) * 0.5;
	//	adjust size
	st -= 0.5;
	st /= max(0.000001,shapeSize);
	st += 0.5;
	
	st = mix(vec2((st.x*resolution.x/resolution.y)-(resolution.x*.5-resolution.y*.5)/resolution.y,st.y), 
				vec2(st.x,st.y*(resolution.y/resolution.x)-(resolution.y*.5-resolution.x*.5)/resolution.x), 
				step(resolution.x,resolution.y));
	
	float		val1 = circleSDF(st);
	float		val2 = starSDF(st,5,0.07);
	float		mixPoint = mod(0.0,2.0);
	if (mixPoint > 1.0)
		mixPoint = 2.0-mixPoint;
	float		val = mix(val1,val2,mixPoint);
	
	// val = 1.0-exp(-val);
	
	
	gl_FragColor = vec4(val);
	// gl_FragColor = vec4(val);

}