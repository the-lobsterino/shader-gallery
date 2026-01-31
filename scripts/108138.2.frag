#extension GL_OES_standard_derivatives : enable

precision highp float;

vec3 mod289(vec3 x) {
  return x - floor(x * (1.0 / 289.0)) * 289.0;
}

vec2 mod289(vec2 x) {
  return x - floor(x * (1.0 / 289.0)) * 289.0;
}

// Modulo 7 without a division
vec3 mod7(vec3 x) {
  return x - floor(x * (1.0 / 7.0)) * 7.0;
}

// Permutation polynomial: (34x^2 + 6x) mod 289
vec3 permute(vec3 x) {
  return mod289((34.0 * x + 10.0) * x);
}

// Cellular noise, returning F1 and F2 in a vec2.
// Standard 3x3 search window for good F1 and F2 values
vec2 cellular(vec2 P) {
#define K 0.142857142857 // 1/7
#define Ko 0.428571428571 // 3/7
#define jitter 1.0 // Less gives more regular pattern
	vec2 Pi = mod289(floor(P));
 	vec2 Pf = fract(P);
	vec3 oi = vec3(-1.0, 0.0, 1.0);
	vec3 of = vec3(-0.5, 0.5, 1.5);
	vec3 px = permute(Pi.x + oi);
	vec3 p = permute(px.x + Pi.y + oi); // p11, p12, p13
	vec3 ox = fract(p*K) - Ko;
	vec3 oy = mod7(floor(p*K))*K - Ko;
	vec3 dx = Pf.x + 0.5 + jitter*ox;
	vec3 dy = Pf.y - of + jitter*oy;
	vec3 d1 = dx * dx + dy * dy; // d11, d12 and d13, squared
	p = permute(px.y + Pi.y + oi); // p21, p22, p23
	ox = fract(p*K) - Ko;
	oy = mod7(floor(p*K))*K - Ko;
	dx = Pf.x - 0.5 + jitter*ox;
	dy = Pf.y - of + jitter*oy;
	vec3 d2 = dx * dx + dy * dy; // d21, d22 and d23, squared
	p = permute(px.z + Pi.y + oi); // p31, p32, p33
	ox = fract(p*K) - Ko;
	oy = mod7(floor(p*K))*K - Ko;
	dx = Pf.x - 1.5 + jitter*ox;
	dy = Pf.y - of + jitter*oy;
	vec3 d3 = dx * dx + dy * dy; // d31, d32 and d33, squared
	// Sort out the two smallest distances (F1, F2)
	vec3 d1a = min(d1, d2);
	d2 = max(d1, d2); // Swap to keep candidates for F2
	d2 = min(d2, d3); // neither F1 nor F2 are now in d3
	d1 = min(d1a, d2); // F1 is now in d1
	d2 = max(d1a, d2); // Swap to keep candidates for F2
	d1.xy = (d1.x < d1.y) ? d1.xy : d1.yx; // Swap if smaller
	d1.xz = (d1.x < d1.z) ? d1.xz : d1.zx; // F1 is in d1.x
	d1.yz = min(d1.yz, d2.yz); // F2 is now not in d2.yz
	d1.y = min(d1.y, d1.z); // nor in  d1.z
	d1.y = min(d1.y, d2.x); // F2 is in d1.y, we're done.
	return sqrt(d1.xy);
}

#define textureOffset 0.1

vec3 texNormalMap(vec2 uv, vec2 resolution)
{
   vec2 s = vec2(1.0) / resolution.xy;
   float p = 1.0 - cellular(uv).y;
   float h1 = 1.0 - cellular(uv + s * vec2(textureOffset, 0.0)).y;
   float v1 = 1.0 - cellular(uv + s * vec2(0.0 ,textureOffset)).y;
   return vec3((p - vec2(h1, v1)), p);
}

#define lightColor vec3(0.9)
#define objectColor vec3(0.2, 0.2, 0.9)

uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;

void main( void ) {
	vec2 res = vec2(min(resolution.x, resolution.y));
	vec2 position = ( gl_FragCoord.xy / vec2(min(resolution.x, resolution.y)) * 8.0 );
	vec3 vpos = vec3(resolution.xy / res * 4.0, 6.0);

	vec2 mposition = ( mouse.xy * 8.0 * resolution.xy / res);
	vec3 mpos = vec3(mposition, 1.0);
	
	vec3 cell = texNormalMap( position, resolution.xy );
	vec3 pos = vec3(position, cell.z * 0.25);
	
	vec3 normal = normalize(vec3( cell.xy * 1500.0 , 1.0 ));
	
	float lightDist = clamp(length(mpos - pos), 0.8, 100.0) * 1.0 - 0.1;
	vec3 lightDir = normalize(mpos - pos);
	
	vec3 viewDir = normalize(vpos - pos);
	vec3 reflectDir = reflect(-lightDir, normal);
	vec3 halfwayDir = normalize(lightDir + viewDir);
	
	float ambientStrength = 0.5;
	vec3 ambient = ambientStrength * lightColor;
	
	float diffuseStrength = 0.75;
	float diff = max(dot(normal, lightDir), 0.0);
	vec3 diffuse = diff * lightColor / lightDist;
	
	float specularStrength = 0.5;
	float spec = pow(max(dot(normal, halfwayDir), 0.0), 40.0);
	vec3 specular = lightColor * spec;
	
	vec3 result = (ambient + diffuse + 0.7*specular) * objectColor + 0.3*specular;
	gl_FragColor = vec4(result, 1.0);
	//  + vec4(vec3(max(0.0, 1.0 - length(mpos - pos))), 1.0)
	
	//gl_FragColor = vec4(normal, 1.0);

}