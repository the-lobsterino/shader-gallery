#ifdef GL_ES
precision mediump float;
#endif

#extension GL_OES_standard_derivatives : enable

uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;
vec3 extra_cheap_atmosphere(float raylen, float sunraylen, float absorbstrength, vec3 absorbcolor, float sunraydot){
    //sundir.y = max(sundir.y, -0.07);
    sunraydot = max(0.0, sunraydot);
    raylen *= absorbstrength * 1.004;
    sunraylen *= absorbstrength * 1.004;
    sunraylen = min(sunraylen, 1.8);
    float raysundt = pow(abs(sunraydot), 2.0);
    float sundt = pow(max(0.0, sunraydot), 8.0);
    float mymie = sundt * raylen;
    vec3 suncolor = mix(vec3(1.0), max(vec3(0.0), vec3(1.0) - absorbcolor), sunraylen);// / (1.0 + raylen);
    vec3 bluesky= absorbcolor * suncolor;
    vec3 bluesky2 = max(vec3(0.0), bluesky - absorbcolor * 0.08 * (raylen));
    bluesky2 *= raylen * (0.24 + raysundt * 0.24);
    return bluesky2 + mymie * suncolor;
}
void main( void ) {

	vec2 position = ( gl_FragCoord.xy / resolution.xy ) ; 
	gl_FragColor = vec4( extra_cheap_atmosphere(position.x, position.y, 3.0, vec3(0.3, 0.5, 0.8), 0.0), 1.0 );

}