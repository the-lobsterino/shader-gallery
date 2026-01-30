#ifdef GL_ES
precision mediump float;
#endif

#extension GL_OES_standard_derivatives : enable

uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;

float random (in vec2 st) { 
    return fract(sin(dot(st.xy,
                         vec2(12.9898,78.233))) 
                * 43758.5453123);
}

// The MIT License
// Copyright © 2013 Inigo Quilez
float noise(vec2 st) {
    vec2 i = floor(st);
    vec2 f = fract(st);
    vec2 u = f*f*(3.0-2.0*f);
    return mix( mix( random( i + vec2(0.0,0.0) ), 
                     random( i + vec2(1.0,0.0) ), u.x),
                mix( random( i + vec2(0.0,1.0) ), 
                     random( i + vec2(1.0,1.0) ), u.x), u.y);
}


const vec3 lightDir = vec3(-0.577, 0.577, 0.577);

// wrote: @c0de4
float distanceFunc(vec3 p) {
	float c = cos(time) - fract(length(p * 2.)) + p.z + fract(p.z * 2.);
	float s = sin(p.z * (p.z) + time * .1) * p.x;
	float dist1 = length(cos(fract(p * 8.) * fract(length(c*p+cos(time))) * .01 - s * .1 + time)) + c - 1.0;
	float dist2 = length(fract(p+noise(vec2(time*.1)))*2.) - cos(time);
	float dist3 = length(p) - 1.0 + p.x * p.x + p.y * p.y;
	
	return length(fract(mix(dist3, mix(dist1, dist3, noise(vec2(p.y+cos(p.z + time)))), noise(vec2(c,s) + sin(time)))));
}

vec3 getNormal(vec3 p) {
  const float d = 0.0001;
  return
    normalize (
      vec3 (
        distanceFunc(p+vec3(d,0.0,0.0))-distanceFunc(p+vec3(-d,0.0,0.0)),
        distanceFunc(p+vec3(0.0,d,0.0))-distanceFunc(p+vec3(0.0,-d,0.0)),
        distanceFunc(p+vec3(0.0,0.0,d))-distanceFunc(p+vec3(0.0,0.0,-d))
      )
    );
}

// wrote: @c0de4
void main( void ) {

	vec2 p = ( gl_FragCoord.xy * 2.0 - resolution ) / min(resolution.x, resolution.y);
	
	vec3 cPos = vec3(.0, 0., 12.+cos(time*.1)*8.);
	vec3 cDir = vec3(0., 0., -1.);
	vec3 cUp  = vec3(0., 1., 0.);
	vec3 cSide = cross(cDir, cUp);
	float focus = 1.0;
	
	vec3 ray = normalize(cSide * p.x + cUp * p.y + cDir * focus);
	
	float t = 0.0, d;
	vec3 posOnRay = cPos;
	
	for(int i=0; i< 5; ++i) {
	  d = distanceFunc(posOnRay);
	  t += d;
	  posOnRay = cPos + t * ray;
	}
	
	
	if(abs(d) < .01) {
	  vec3 normal = getNormal(posOnRay);
	  float diff = clamp(dot(lightDir, normal), 0.1, 1.0);
	  gl_FragColor = vec4(vec3(diff+.7, diff+sin(time*.1)+.2, normal+.5), 1.0);
	} else {
	  gl_FragColor = vec4(0.);
	}

}
