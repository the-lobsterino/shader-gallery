#ifdef GL_ES
precision mediump float;
#endif

uniform float time;
varying vec2 surfacePosition;
uniform vec2 mouse;
uniform vec2 resolution;

#define PI 3.14159265358979323846264

vec3 foo() {
	
	vec2 uv = gl_FragCoord.xy / resolution.xy;
	vec2 aspect = vec2( resolution.x / resolution.y, 1.0 );
	vec2 p = ( uv * 2.0 - 1.0 ) * aspect;
	p*=1.0;
	vec2 mt = (mouse * 2.0 - 1.0) * aspect;	
	vec3 c;
	float t2 = time*0.1+200.0;
	
	for(float i = 0.0; i < 100.0; i++)
	{
		float r = cos(i * 50.0);	
		vec2 cp = vec2(r + sin(t2*(r+0.5)*0.5), (cos(t2*0.5*(r+0.5)))*1.1);
		float d = distance(cp, p) / (0.08+distance(cp, mt)*0.1);
		float a = pow(sin(t2*48.0 + r), 0.66);
		float e = smoothstep(-a*0.3, 0.1, 1.0 - d)-0.001;
		c += (e) * mix(vec3(0.0, 0.1, 0.9), vec3(0.0, 0.5, 0.9), a);
	}
	
	c *= 0.5;
	c *= smoothstep(-1.5, 1.0, 1.0 - length(p))*0.9;
	c = pow(c, vec3(0.7, 0.7, 1.0));
	c -= 0.05;
	c+= fract(sin(dot(p, vec2(344.4324, 864.0))*5.3543)*2336.65)*0.02;
	return c;

}

// My version of the planet. -- novalis




//////////// start of webgl-noise ////////////////
// Description : Array and textureless GLSL 2D simplex noise function.
//      Author : Ian McEwan, Ashima Arts.
//  Maintainer : ijm
//     Lastmod : 20110822 (ijm)
//     License : Copyright (C) 2011 Ashima Arts. All rights reserved.
//               Distributed under the MIT License. See LICENSE file.
//               https://github.com/ashima/webgl-noise
// 

vec3 mod289(vec3 x) {
  return x - floor(x * (1.0 / 289.0)) * 289.0;
}

vec2 mod289(vec2 x) {
  return x - floor(x * (1.0 / 289.0)) * 289.0;
}

vec3 permute(vec3 x) {
  return mod289(((x*34.0)+1.0)*x);
}

float snoise(vec2 v)
  {
  const vec4 C = vec4(0.211324865405187,  // (3.0-sqrt(3.0))/6.0
                      0.366025403784439,  // 0.5*(sqrt(3.0)-1.0)
                     -0.577350269189626,  // -1.0 + 2.0 * C.x
                      0.024390243902439); // 1.0 / 41.0
// First corner
  vec2 i  = floor(v + dot(v, C.yy) );
  vec2 x0 = v -   i + dot(i, C.xx);

// Other corners
  vec2 i1;
  //i1.x = step( x0.y, x0.x ); // x0.x > x0.y ? 1.0 : 0.0
  //i1.y = 1.0 - i1.x;
  i1 = (x0.x > x0.y) ? vec2(1.5, 0) : vec2(0.0, 1.0);
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

  vec3 x = 2.0 * fract(p * C.www) - 1.0;
  vec3 h = abs(x) - 0.5 ;
  vec3 ox = floor(x + 0.5);
  vec3 a0 = x - ox;

// Normalise gradients implicitly by scaling m
// Approximation of: m *= inversesqrt( a0*a0 + h*h );
  m *= 1.79284291400159 - 0.2 * ( a0*a0 + h*h );

// Compute final noise value at P
  vec3 g;
  g.x  = a0.x  * x0.x  + h.x  * x0.y;
  g.yz = a0.yz * x12.xz + h.yz * x12.yw;
  return 130.0 * dot(m, g);
}

////////////// end of webgl-noise //////////////////

float height_map(vec2 coord) {
	float n = snoise(coord);
	n += 0.5 * snoise(coord * 2.0);
	n += 0.25 * snoise(coord * 4.0);
	n += 0.125 * snoise(coord * 8.0);
	n += 0.0625 * snoise(coord * 16.0);
	n += 0.03125 * snoise(coord * 32.0);
	n += 0.03125 * snoise(coord * 64.0);
	n += 0.03125 * snoise(coord * 128.0);
	return n;
}

void main(void) {	
	vec2 flat_uv = surfacePosition*2.3; // zoom out a bit
	
	// transform to polar coordinate system
	float r   = length(flat_uv);
	float phi = atan(flat_uv.y, flat_uv.x);
	
	// and project onto sphere
	r = 2./PI * asin(r);

	vec3 bar = foo();
	r = bar.b + r;
	
	vec2 sphere_uv = vec2(r*cos(phi), r*sin(phi));

	
	// axial tilt: earth as example
	float axial_tilt = 23.4392811*2.*PI/360.;
	float rotation_speed = .02;
	sphere_uv.x += time*rotation_speed*acos(axial_tilt);
	sphere_uv.y += time*rotation_speed*asin(axial_tilt);

	// get height for fragment
	float height = height_map(sphere_uv);

	// mix surface color
	vec3 deepOceanColor = vec3(0,0,.3);
	vec3 oceanColor     = vec3(0,0,.9);
	vec3 terrainColor   = vec3(.1,.5,.1);
	vec3 mountainColor  = vec3(.9,.7,0);
	vec3 snowColor      = vec3(1,1,1);
	
	vec3 color = vec3(0);
	if (length(flat_uv) < 1.) {
		color = deepOceanColor;
		color = mix(color, oceanColor   , smoothstep(-.05, .1, height));
		color = mix(color, terrainColor , smoothstep(0., .2, height));
		color = mix(color, mountainColor, smoothstep(0., .87, height));
		color = mix(color, snowColor    , smoothstep(.95, 1.2, height));
		
		// some clouds with shadows
		vec2 offset = vec2(123.45, 321.23);
		vec3 cloud_color = mix(color, color/10., smoothstep(.1, .5, height_map(sphere_uv+offset-vec2(.01,.01)))); // shadow
		cloud_color += vec3(smoothstep(.1, .5, height_map(sphere_uv+offset))); // clouds
		color = mix(color, cloud_color, .85);
		
		// some gamma fading
		color = mix(color, pow(color, vec3(.1))/2., smoothstep(.5, 1., r));
		
		// some sun
		color = mix(color, color/10., smoothstep(-.1, .5, r*cos(phi)*asin(r)));
	}
	
	// some atmosphere
	if (length(flat_uv) > 1. && length(flat_uv) < 1.03) {
		color = mix(vec3(0,.4,.8), color, smoothstep(1., 1.03, length(flat_uv)));
		color = mix(color, color/5., smoothstep(-.4, .4, flat_uv.x));
	}

	gl_FragColor = vec4(pow(color, vec3(1./1.1)), 1);
}
