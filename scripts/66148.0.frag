// 150720N & al.
#ifdef GL_ES
precision mediump float;
#endif

#extension GL_OES_standard_derivatives : enable

uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;
uniform sampler2D backbuffer;
varying vec2 surfacePosition;

vec2 lengmax(vec2 a, vec2 b){
	if(length(a) > length(b)){
		return a;
	}
	return b;
}
vec2 lengmin(vec2 a, vec2 b){
	if(length(a) > length(b)){
		return b;
	}
	return a;
}
#define tex2(_d) texture2D(backbuffer, fract((gl_FragCoord.xy+_d+0.5*(lengmax(surfacePosition, normalize(surfacePosition))+32.*vec2(cos(time*1e-2+4.*length(surfacePosition)), sin(time*5e-2+4.*length(surfacePosition)))+vec2(0,-.04)))/resolution))

void main( void ) {
	
	vec2 position = (gl_FragCoord.xy * 2.0 - resolution) / min(resolution.x, resolution.y);
	position /= dot(position,position);
	vec3 destColor = vec3(0.25, 0.25, 1.0);
	vec3 destForm = vec3(0.0);
	
	for (float i = 0.0; i < 55.0; i++) {
		float j = i + 1.0;
		float q = position.y += (sin(position.x * 2.0 + time / 9.0 * cos(j * 0.314)) * 0.09*tan(0.1*time+length(position)/(1.+length(destForm)*3e4)));
		float l = 0.0025 / abs(q);
		destForm += vec3(l);
	}
	
	gl_FragColor = vec4(vec3(destColor * destForm), 1.0);
	
	gl_FragColor = max(gl_FragColor, tex2(0.)-8./256.);
	gl_FragColor = min(gl_FragColor, tex2(0.)+33./256.);
	
	gl_FragColor = max(gl_FragColor, 
			   ((0.
			   +tex2(vec2(1,1))
			   +tex2(vec2(1,-1))
			   +tex2(vec2(-1,1))
			   +tex2(vec2(-1,-1))
			   +2.*max( tex2(vec2(-1,0)), tex2(vec2(1,0)) )
			   +2.*max( tex2(vec2(0,-1)), tex2(vec2(0,1)) )
			   )/8.)-.04*vec4(0.2,1.,2.,1)
			  );
	
	gl_FragColor.xyz = fract( gl_FragColor.xyz + dot(gl_FragColor.xyz,gl_FragColor.xyz));
}