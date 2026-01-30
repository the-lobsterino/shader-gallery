#extension GL_OES_standard_derivatives : enable

precision mediump float;

uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;


#define DISTORTION_STRENGTH (32.0+31.0*sin(time))

vec3 sampleColor(vec2 uv)
{
	return vec3(step(min(fract(uv.x * 20.0), fract(uv.y * 20.0)), 0.1));
}



vec2 linearToPolarUV(vec2 linearUV, vec2 centerPos) {
    vec2 srcVec = linearUV - centerPos;
	
    float r = length(srcVec);
    float rSpherical = (exp(r * log(DISTORTION_STRENGTH + 1.0)) - 1.0) / DISTORTION_STRENGTH;
    return normalize(srcVec) * rSpherical + centerPos;
}


void main( void ) {

	vec2 uv = ( gl_FragCoord.xy / resolution.xy );
	uv = linearToPolarUV(uv, mouse);
	
	gl_FragColor = vec4( sampleColor(uv), 1.0 );

}