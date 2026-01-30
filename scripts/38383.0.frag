#ifdef GL_ES
precision mediump float;
#endif

#extension GL_OES_standard_derivatives : enable

uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;

float rand(vec2 n) { 
    return fract(sin(dot(n, vec2(12.9898, 4.1414))) * 43758.5453);
}

float noise(vec2 p){
    vec2 ip = floor(p);
    vec2 u = fract(p);
    u = u*u*(3.0-2.0*u);

    float res = mix(
        mix(rand(ip),rand(ip+vec2(1.0,0.0)),u.x),
        mix(rand(ip+vec2(0.0,1.0)),rand(ip+vec2(1.0,1.0)),u.x),u.y);
    return res*res;
}

void main( void ) {

	vec2 position = ( gl_FragCoord.xy / resolution.xy );
	float myTime = time * 1.0;
	
	//float yf = mod( time, 5. );
	float xf = sin( myTime * 3. + position.y * sin( myTime * 3. + cos( myTime * 0.5 ) ) * 3. ) * 0.03;
	float dist = 1. - abs( 0.5 - position.x + xf );
	float dist2 = distance( vec2( 0.5, 0.7 ), position );
	
	dist = pow( dist, 2. );// + ( 1. - dist2 ) * 2.;
	dist = max( 0.4, dist );
	//dist = smoothstep( -0.3, 1., dist );
	//dist *= max( sin( position.y * 2. ) * ( sin( time ) + 3. ), 15. );
	
	//dist = mix( 0.7, 1., dist );
	
	vec2 posNoise = position * 15.;
	
	//posNoise = vec2( position.y * 3.0, sin( time * 0.3 )* 10. );
	posNoise = vec2( position.y * 2.0, mod( time, 100. ));
	float n = noise( posNoise ) * 0.5 * dist2;
	dist += n;
	float yOffset = position.y + sin( myTime * 3.0 ) * 0.2;
	float brightness = noise( posNoise ) + 0.5;
	float rf = sin( myTime );
//	vec3 rgb = vec3( dist ) * vec3( 1., 1., .5 );
	vec3 rgb;
	rgb.r = ( sin( myTime * 1.3 ) + 3.3 ) * 0.3 * dist + sin( myTime + dist2 ) * 0.2;
	rgb.g = max( ( sin( myTime ) + 1.3 ) * dist, rgb.r * 0.6 );
	rgb.b = sin( myTime * 2. );
	//rgb += vec3( dist ) * 0.3;
//	gl_FragColor = vec4( rgb, 1.0 );
	float circle = ( 1. - pow( dist2 , 5. )) * 2.;
	rgb *= vec3( circle );
	gl_FragColor = vec4(rgb, 1.0 );

}