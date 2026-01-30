//PALM TREE LEARNED HERE: https://www.youtube.com/watch?v=0ifChJ0nJfM
//THANKS TO Iñigo Quilez

#ifdef GL_ES
precision mediump float;
#endif

uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;


//
// Description : Array and textureless GLSL 2D simplex noise function.
//      Author : Ian McEwan, Ashima Arts.
//  Maintainer : ijm
//     Lastmod : 20110822 (ijm)
//     License : Copyright (C) 2011 Ashima Arts. All rights reserved.
//               Distributed under the MIT License. See LICENSE file.
//               https://github.com/ashima/webgl-noise
// 
// SOME NOOB COMMENTS WHILE I EXPLORE THINGS... BE WARNED!!! get original noise code from github link above.
// SOME NOOB COMMENTS WHILE I EXPLORE THINGS... BE WARNED!!! get original noise code from github link above.
// SOME NOOB COMMENTS WHILE I EXPLORE THINGS... BE WARNED!!! get original noise code from github link above.
// SOME NOOB COMMENTS WHILE I EXPLORE THINGS... BE WARNED!!! get original noise code from github link above.

vec3 mod289( vec3 x ) 
{
	return x - floor( x * ( 1.0 / 289.0 ) ) * 289.0;
}

vec2 mod289( vec2 x ) 
{
	return x - floor( x * ( 1.0 / 289.0 ) ) * 289.0;
}

vec3 permute( vec3 x ) 
{
	return mod289( ( ( x * 34.0 ) + 1.0 ) * x );
}

float snoise( vec2 v )
{ 
	const vec4 C = vec4( 0.211324865405187,  // (3.0-sqrt(3.0))/6.0  ; for skewing simplex origin to cartesian space???
		       0.366025403784439,  // 0.5*(sqrt(3.0)-1.0)        ; for skewing input coord's to "simplex space"???
		      -0.577350269189626,  // -1.0 + 2.0 * C.x           ; offset for finding simplex corners in cartesian space???
		       0.024390243902439); // 1.0 / 41.0
	
	// First corner
	vec2 i  = floor( v + dot( v, C.yy ) ); 
	vec2 x0 = v - i + dot( i, C.xx ); 
	
	// Other corners
	vec2 i1;
	//i1.x = step( x0.y, x0.x ); // x0.x > x0.y ? 1.0 : 0.0
	//i1.y = 1.0 - i1.x;
	i1 = (x0.x > x0.y) ? vec2(1.0, 0.0) : vec2(0.0, 1.0);
	// x0 = x0 - 0.0 + 0.0 * C.xx ;
	// x1 = x0 - i1 + 1.0 * C.xx ;
	// x2 = x0 - 1.0 + 2.0 * C.xx ;
	vec4 x12 = x0.xyxy + C.xxzz;
	x12.xy -= i1;
	
	// Permutations
	i = mod289(i); // Avoid truncation effects in permutation
	vec3 p = permute( permute( i.y + vec3(0.0, i1.y, 1.0 )) + i.x + vec3(0.0, i1.x, 1.0 ));
	
	vec3 m = max(0.5 - vec3(dot(x0,x0), dot(x12.xy,x12.xy), dot(x12.zw,x12.zw)), 0.0);
	m = m*m ;
	m = m*m ;
	
	// Gradients: 41 points uniformly over a line, mapped onto a diamond.
	// The ring size 17*17 = 289 is close to a multiple of 41 (41*7 = 287)
	
	vec3 x = 2.0 * fract(p * C.www) - 1.0;
	vec3 h = abs(x) - 0.5;
	vec3 ox = floor(x + 0.5);
	vec3 a0 = x - ox;
	
	// Normalise gradients implicitly by scaling m
	// Approximation of: m *= inversesqrt( a0*a0 + h*h );
	m *= 1.79284291400159 - 0.85373472095314 * ( a0*a0 + h*h );
	
	// Compute final noise value at P
	vec3 g;
	g.x  = a0.x  * x0.x  + h.x  * x0.y;
	g.yz = a0.yz * x12.xz + h.yz * x12.yw;
	return 130.0 * dot(m, g);
}

float hash( float n )
{
	return fract( sin(n) * 43758.5453 );
}

float noise( vec2 at )
{	
	vec2 p = floor( at );
	vec2 k = fract( at );
	k = k * k * ( 3.0 - 2.0 * k );
	
	float n = p.x + p.y * 57.;
	
	float a = hash( n );
	float b = hash( n + 1.0 );
	float c = hash( n + 57.0 );
	float d = hash( n + 58.0 );
	float e = hash( n + 113.0 );
	float f = hash( n + 114.0 );
	float g = hash( n + 170.0 );
	float h = hash( n + 171.0 );
	
	float res = mix( mix( a, b, k.x ), mix( c, d, k.x ), k.y );
	
	return res;
}

float fbm( vec2 at )
{
	float f = 0.0;
	f += 0.5000 * noise( at ); 
	at *= 2.02;
	f += 0.2500 * noise( at ); 
	at *= 2.03;
	f += 0.1250 * noise( at ); 
	at *= 2.01;
	f += 0.0625 * noise( at ); 
	return f/0.9375;
}

float tvStatic( vec2 at ) //Lazy noise
{
	return fract( sin( dot( at.xy, vec2( 12.9898, 78.233 ) ) ) * 43758.5453 );
	//return fract( sin( dot( at.xy, vec2( 100.0, 10.0 ) ) ) * 1000.09 );
}

float sun( in vec2 at )
{
	at.y /= time / 10.0;
	float n1 = tvStatic( at );
	float n2 = tvStatic( vec2( at.x + 1.0, at.y ) );
	float n3 = tvStatic( vec2( at.x, at.y + 1.0 ) );
	float n4 = tvStatic( vec2( at.x + 1.0, at.y + 1.0 ) );
	float avgN = ( n1 + n2 + n3 + n4 ) / 4.0;
	return avgN;
}

void main( void ) {

	//Normalize frag coods
	vec2 pos = ( gl_FragCoord.xy / resolution.xy );

	//Base color
	vec4 color = mix( vec4( 1.0, 0.0, 1.0, 1.0 ), vec4( 1.0, 0.0, 0.0, 1.0 ), pos.y );
	
	//Backround effects
	//...
	
	//color.g += snoise( pos * time );
	//color.g += fbm( pos * time );
	//color.g += tvStatic( pos * time );
	
	//color.g += snoise( pos );
	color.g += fbm( vec2( pos.x, pos.y + time / 1000.0 ) * 1000.0 );
	//color.g += tvStatic( pos );
	
	color.rgb -= fbm( vec2( pos.x + time / 100.0, pos.y + 0.01 * cos( time / 10.0 ) ) * 10.0 ) * smoothstep( 0.3, 0.0, pos.y );
	
	////
	float dayTime = time / 15.0;
	
	vec2 sPos = vec2( pos.x + 2.1 * tan( dayTime ), pos.y );
	color.r -= smoothstep( 0.8, 0.9, sqrt( dot( sPos, sPos ) ) - 0.5 );
	color.g -= smoothstep( 0.8, 0.9, sqrt( dot( sPos, sPos ) ) - 0.5 ) / 2.0;
	//color.g *= color.r + 0.3;
	
	////
	
	//Center of palm frond
	vec2 c = vec2( 0.7, 0.5 + 0.003 * cos( time / 2.0 ) );
	
	//Vector from frag coord to palm frond center
	vec2 dis = pos - c;
	
	//Radius of frond
	float r = 0.18 + 0.1*cos( atan( dis.y, dis.x ) * 11.0 + 0.15 * cos(time / 2.0 ) + dis.x * 20.0 );
	
	//Draw frond
	color.rgb *= smoothstep( r, r+0.01, length( dis ) );
	
	//Width of trunk
	float w = 0.01 + 0.001*cos(120.0*pos.y);
	w += exp( -120.0 * pos.y );
	
	//Draw trunk
	color.rgb *= 1.0 - ( 1.0 - smoothstep( w, w+ 0.005, abs( c.x - pos.x * cos( dis.y ) ) ) ) * smoothstep( 0.0, 0.01, -dis.y );
	
	gl_FragColor = color;
}