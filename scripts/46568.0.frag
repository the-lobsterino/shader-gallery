#ifdef GL_ES
precision mediump float;
#endif

#extension GL_OES_standard_derivatives : enable

uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;
float DistributionGGX(vec3 N, vec3 H, float a)
{
    float a2     = a*a;
    float NdotH  = max(dot(N, H), 0.0);
    float NdotH2 = NdotH*NdotH;
	
    float nom    = a2;
    float denom  = (NdotH2 * (a2 - 1.0) + 1.0);
    denom        = 3.1415 * denom * denom;
	
    return nom / denom;
}
void main( void ) {

	vec2 position = ( gl_FragCoord.xy / resolution.xy ) * 2.0 - 1.0;

	vec3 N = normalize(vec3(position.x, 1.0, position.y));
	vec3 L = vec3(0.0, 1.0, 0.0);
	vec3 H = (N + L) * 0.5;
	float color = DistributionGGX(N, H, mouse.x);

	gl_FragColor = vec4( vec3( color ), 1.0 );

}