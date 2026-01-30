#ifdef GL_ES
precision mediump float;
#endif

#extension GL_OES_standard_derivatives : enable

uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;
uniform sampler2D backbuffer;

const float PI = acos(-1.);

float distFunc2(vec3 p,vec2 cl,vec4 sl)
{
	vec2 cd = abs(vec2(length(p.yz),p.x)) - cl;
	float c = min(max(cd.x,cd.y),0.0) + length(max(cd,0.0));
	float s = length(abs(p) - sl.xyz) - sl.w;
	return min(c,s);
}

mat2 rot(float a)
{
	float co = cos(a), si = sin(a);
	return mat2(co,si,-si,co);
}

float distFunc(vec3 p)
{
	p.z -= 1.0 + fract(time / 3.) * 3.;
	//p = mod(p, 2.) - 1.;
	p.z = mod(p.z, 3.) - 2.85;
	//p.x = mod(p.x, 4.) - 2.;
	
	// for(float i = 0.; i<1.; i++) {
	// 	p.x = mod(p.x, .4) - .1;
	// 	//p.x = abs(p.x) - .2;
	// 	//p.xz *= rmat;
	// 	p.zy *= rot(.4 + i);
	// }
	
	float d = distFunc2(p, vec2(.01,.8), vec4(0.8,0.,0.,.05));
	for(float i = 1.; i<20.; i++) {
		p.z += .15;
		p.xy *= rot(PI * .05);
		d = min(d, distFunc2(p, vec2(.01,.8), vec4(0.8,0.,0.,.05)));
	}
	return d;
}

vec3 calcNormal(vec3 p)
{
	vec2 e = vec2(0.0025, 0.);
	return normalize(vec3(
		distFunc(p + e.xyy) - distFunc(p - e.xyy),
		distFunc(p + e.yxy) - distFunc(p - e.yxy),
		distFunc(p + e.yyx) - distFunc(p - e.yyx)
	));
}

void main( void ) {
	vec2 uv = (gl_FragCoord.xy * 2. - resolution.xy ) / min(resolution.x, resolution.y);

	vec3 color = vec3((1. - distance(vec2(0.),uv))+.5);
	float mask = 0.;
	
	vec3 cameraPos = vec3(cos(time) * .7,sin(time) * .7,1.);
	//cameraPos = vec3(0.,0.,1.);
	vec3 lockAtPos = vec3(0.,0.,0.);
	vec3 forwardDir = normalize(lockAtPos - cameraPos);
	vec3 sideDir = normalize(cross(vec3(0.,1.,0.), forwardDir));
	vec3 upDir = normalize(cross(forwardDir, sideDir));
	float focalLength = (color.x) + 1.;
	vec3 rayDir = normalize(focalLength * forwardDir + uv.x * sideDir + uv.y * upDir);
	
	vec3 lightPos = vec3(1.,1.,1.);
	vec3 lightTarget = vec3(0.);
	vec3 lightDir = normalize(lightTarget - lightPos);
	
	vec3 rayPos = cameraPos + rayDir * .1;
	for (int i = 0; i < 64; i++)
	{
		float d = distFunc(rayPos);
		if (d < 0.001)
		{
			vec3 normal = calcNormal(rayPos);
			float spec = pow(max(0., dot(rayDir, reflect(-lightDir , normal))), 5.);
			float s = dot(-lightDir, normal) * .5 + .5;
			//color = vec3(s * s) * (normal * .5 + .5) + vec3(spec);
			color = mix(
				vec3(s * s) * (normal * .5 + .5) + vec3(spec),
				vec3(0.1),
				vec3(min(1.0,abs(rayPos.z) * .2))
			);
			mask = 1.;
			break;
		}
		rayPos += rayDir * d;
	}

	vec4 prevColor = texture2D(backbuffer, gl_FragCoord.xy / resolution) * 0.7;
	gl_FragColor = vec4(prevColor.xyz * (1.-mask) + color * mask ,1.);

}