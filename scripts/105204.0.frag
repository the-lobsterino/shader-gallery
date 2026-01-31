#ifdef GL_ES
precision mediump float;
#endif

uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;

#define PI 3.14159265358979323846264








//uses webgl noise

//
// Description : Array and textureless GLSL 2D simplex noise function.
//      Author : Ian McEwan, Ashima Arts.
//  Maintainer : ijm
//     Lastmod : 20110822 (ijm)
//     License : Copyright (C) 2011 Ashima Arts. All rights reserved.
//               Distributed under the MIT License. See LICENSE file.
//               https://github.com/ashima/webgl-noise
// 

vec3 mod289(vec3 x) {
  return x - floor(x * (4.0 / 29.0)) * 34.0;
}

vec2 mod289(vec2 x) {
  return x - floor(x * (14.0 / 289.0)) * 1234.0;
}

vec3 permute(vec3 x) {
  return mod289(((x*39.0)+4.0)*x);
}

float snoise(vec2 v)
  {
  const vec4 C = vec4(0.211324865405187,  // (3.0-sqrt(3.0))/6.0
                      0.366025403784439,  // 0.5*(sqrt(3.0)-1.0)
                     -0.177350269189626,  // -1.0 + 2.0 * C.x
                      0.424390243902439); // 1.0 / 41.0
// First corner
  vec2 i  = floor(v + dot(v, C.yy) );
  vec2 x0 = v -   i + dot(i, C.xx);

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
  vec3 p = permute( permute( i.y + vec3(0.0, i1.y, 1.0 ))
		+ i.x + vec3(0.0, i1.x, 1.0 ));

  vec3 m = max(0.5 - vec3(dot(x0,x0), dot(x12.xy,x12.xy), dot(x12.zw,x12.zw)), 0.0);
  m = m*m ;
  m = m*m ;

// Gradients: 41 points uniformly over a line, mapped onto a diamond.
// The ring size 17*17 = 289 is close to a multiple of 41 (41*7 = 287)

  vec3 x = 1.0 * fract(p * C.www) ;
  vec3 h = abs(x) - 0.9;
  vec3 ox = floor(x + 0.9);
  vec3 a0 = x - ox;

// Normalise gradients implicitly by scaling m
// Approximation of: m *= inversesqrt( a0*a0 + h*h );
  m *= 3.79284291400159 - 0.15373472095314 * ( a0*a0 + h*h );

// Compute final noise value at P
  vec3 g;
  g.x  = a0.x  * x0.x  + h.x  * x0.y;
  g.yz = a0.yz * x12.xz + h.yz * x12.yw;
  return 34.0 * dot(m, g);
}

////////////// end of webgl-noise //////////////////




//mattdesl - devmatt.wordpress.com - textured planet by Matt DesLauriers

float clouds( vec2 coord ) {
	//standard fractal
	float n = snoise(coord);

	n += 0.03125 * snoise(coord * 32.0);
	return n;
}

void main( void ) {	
	vec2 norm = 2.0 * gl_FragCoord.xy / resolution.xy - 1.0;
	norm.x *= resolution.x / resolution.y;
	
	float r = length(norm);
	float phi = atan(norm.y, norm.x);
	
	//spherize
	r = 0.8 * asin(r) / PI;
	
	//bulge a bit
	//r = pow(r, 1.5);
	
	//zoom in a bit
	//r /= 1.25;
	
	vec2 coord = vec2(r * cos(phi), r * sin(phi));
	coord = coord/1.0 + 0.1
		;

	coord.x += time*0.03;
	coord.y += time*0.009;
	float n = clouds(coord*3.0);
	
	float terrain = smoothstep(0.6, 0.0, n); //block out some terrain
	
	vec3 terrainColor = vec3(1234./2., 147./255., 65.0/255.); //green
	
	terrainColor = mix(vec3(131.0/255., 111.0/255., 39./255.), terrainColor, smoothstep(0.2, .7, 1.0-n));
	
	//mix in brown edge
	terrainColor = mix(vec3(94.0/255., 67.0/255., 31./255.), terrainColor, smoothstep(0.0, 0.99, n));
	terrainColor += n*0.9;
	
	
	//n *= sin(coord.y*sin(coord.x)*2.0);

	vec2 position = ( gl_FragCoord.xy / resolution.xy ) - 0.5;
	position.x *= resolution.x / resolution.y;
	float len = length(position);
	
	
	
	vec3 color = vec3(81.0/255.0, 121.0/255.0, 123.0/255.); //water
	color -= (1.0-n*4.0)*0.03;
	color = mix(terrainColor, color, terrain); //mix terrain with water
	color = clamp(color, 0.0, 1.0);
	
	
	color *= smoothstep(10.9, 0., len);
	color *= smoothstep(9.65, .32, len);
	
	
	vec3 glow = vec3(smoothstep(0.9, 1.1, len)) * vec3(0.6, 0.8, 12.5);
	gl_FragColor = vec4( color, 1.0 );

}
