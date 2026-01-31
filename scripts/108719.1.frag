precision highp float;

uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;
uniform sampler2D backbuffer;

// Centered remainder
vec3 rem(vec3 a, float b) {
	return sign(a) * (abs(a) - b * floor(abs(a) / b));
}
	
struct ColorProfile {
	vec3 diffuse;
	vec3 specular;
	vec3 ambient;
	float roughness;
};

struct SDFOut {
	float depth;
	vec3 position;
	vec3 normal;
	ColorProfile color;
};
	
struct SDHit {
	float distance;
	ColorProfile color;
};
	
SDHit sdUnion( SDHit a, SDHit b ) {
	if (a.distance < b.distance) return a;
	return b;
}
	
SDHit sdSphere( vec3 p, float s, ColorProfile c ) {
	return SDHit(length(p)-s, c);
}

SDHit sdPlane( vec3 p, ColorProfile c ) {
	return SDHit(p.y, c);
}

SDHit sdBox( vec3 p, vec3 b, ColorProfile c ) {
	vec3 q = abs(p) - b;
	return SDHit(length(max(q,0.0)) + min(max(q.x,max(q.y,q.z)),0.0), c);
}

const int MAX_STEPS = 256;
const float EPSILON = 1e-4;
const float FAR_PLANE = 100.0;

mat3 rotateX(float angle) {
	return mat3(
		cos(angle), -sin(angle), 0.,
		sin(angle),  cos(angle), 0.,
		        0.,          0., 1.
	);
}

mat3 rotateY(float angle) {
	return mat3(
		cos(angle), 0., -sin(angle),
		        0., 1.,          0.,
		sin(angle), 0.,  cos(angle)
	);
}

mat3 rotateZ(float angle) {
	return mat3(
		1.,         0.,          0.,
		0., cos(angle), -sin(angle),
		0., sin(angle),  cos(angle)
	);
}

SDHit sdScene(vec3 pos) {
	SDHit sphere = sdBox(rotateY(time * 0.) * pos, vec3(.25), ColorProfile(
		vec3(1, 0., 0.), vec3(1), vec3(0.1), 8.
	));
	SDHit plane = sdPlane(pos - vec3(0, -20, 0), ColorProfile(
		vec3(1.), vec3(1.), vec3(0), 8.	
	));
	return sdUnion(sphere, plane);
}

vec3 calcNormal(float distance, vec3 pos) {
	return normalize(vec3(
		(sdScene(pos + vec3(EPSILON, 0, 0)).distance - distance),
		(sdScene(pos + vec3(0, EPSILON, 0)).distance - distance),
		(sdScene(pos + vec3(0, 0, EPSILON)).distance - distance)
	));
}

SDFOut march(vec3 pos, vec3 angle) {

	float depth = 0.;
	for (int i = 0; i < MAX_STEPS; i++) {
		SDHit hit = sdScene(pos);
		if (hit.distance < EPSILON) {
			return SDFOut(depth, pos, calcNormal(hit.distance, pos), hit.color);
		} else if (hit.distance > FAR_PLANE) {
			break;
		}
		pos += angle * hit.distance;
		depth += hit.distance;
		
	}
	return SDFOut(3.4e38, pos, -angle, ColorProfile(vec3(0), vec3(0), vec3(0), 0.));
}

struct Light {
	vec3 position;
	vec3 color;
	float power;
};

const int NUM_LIGHTS = 1;

vec3 phongLight(SDFOut hit, vec3 cameraPos, vec3 rayDir) {
	vec3 colorSum = hit.color.ambient;
	Light lights[NUM_LIGHTS];
	lights[0] = Light(vec3(7, 4, 2), vec3(1., 1., 1.), 10.0);
	for (int i = 0; i < NUM_LIGHTS; i++) {
		Light light = lights[i];
		vec3 lightDir = normalize(light.position - hit.position);
		float distance = length(light.position - hit.position);
		vec3 reflection = reflect(lightDir, hit.normal);
		float alignment = max(0.0, dot(reflection, rayDir));
		vec3 colorAdd = 
			hit.color.diffuse * max(dot(hit.normal, lightDir), 0.0) / distance * light.power + // Diffuse
			hit.color.specular * clamp(pow(alignment, hit.color.roughness), 0.0, 1.0) // Specular
			;
		colorAdd *= light.color;
		colorSum += colorAdd;
	}
	return clamp(colorSum, 0.0, 1.0);
}

const float PI = 3.141592653589793238462643383279502884197;
const float ROTSPEED = .2;
const float LINSPEED = .02;

void main( void ) {
	if (time < 0.05) {
		gl_FragColor = vec4(vec3(0), 1.0);
		if ((resolution.x - gl_FragCoord.x) < 16. && gl_FragCoord.y < 1.) {
			gl_FragColor = vec4(vec3(0.5), 1.0);
		}
		return;
	}
	vec2 rotation = texture2D(backbuffer, vec2(0)).xy;
	rotation *= vec2(2. * PI, PI); 
	vec3 worldPos = (texture2D(backbuffer, vec2(1, 0)).xyz - 0.5);
	worldPos += (texture2D(backbuffer, vec2(1. - (2.5 / resolution.x), 0)).xyz - 0.5) * 16.;
	//worldPos += (texture2D(backbuffer, vec2(1. - (2.5 / resolution.x), 0)).xyz - 0.5) * pow(16., 1.);
	vec2 position = ( gl_FragCoord.xy / resolution.xy );
	float ratio = (resolution.x / resolution.y);
	vec2 mouseSign = sign(mouse - 0.5);
	vec2 absMouse = abs((mouse - 0.5) * vec2(ratio, 1.)) * 2.;
	if (length(gl_FragCoord.xy) < 1.) {
		if (absMouse.x > 0.8 && absMouse.x < 1. && absMouse.y < 0.3) {
			rotation.x += (absMouse.x - 0.5) * mouseSign.x / (2. * PI) * ROTSPEED;
		}
		if (absMouse.y > 0.8 && absMouse.y < 1. && absMouse.x < 0.3) {
			rotation.y += (absMouse.y - 0.5) * mouseSign.y / PI * ROTSPEED;
		}
		rotation /= vec2(2. * PI, PI);
		rotation.x = mod(rotation.x, 1.0);
		gl_FragColor = vec4(rotation, 1., 1);
		return;
	}
	if (gl_FragCoord.y < 1. && (resolution.x - gl_FragCoord.x) < 16.) {
		float offset = (resolution.x - gl_FragCoord.x);
		float prevMul = pow(16., offset - 1.5);
		float mul = pow(16., offset - 0.5);
		float nextMul = pow(16., offset + 0.5);
		if (min(absMouse.x, absMouse.y) > 0.8 && max(absMouse.x, absMouse.y) < 1.) {
			vec3 moveAmt = vec3(0., 0., 1.);
			moveAmt = rotateY(rotation.x) * rotateZ(rotation.y - (PI / 2.)) * moveAmt;
			if (mouseSign.x < 0.0) {
				moveAmt *= -1.;
			}
			worldPos += moveAmt * LINSPEED;
		}
		vec3 encodedPos = floor(worldPos / prevMul) * prevMul * mul;
		if ((resolution.x - gl_FragCoord.x) == 0.5) {
			encodedPos = worldPos * mul;
		}
		encodedPos = rem(encodedPos, nextMul) + 0.5;
		gl_FragColor = vec4(clamp(encodedPos, 0., 1.), 1.);
		return;
	}

	position -= 0.5;
	position.x *= ratio;
	position *= 2.;
	vec3 localCast = normalize(vec3(position, 0.8));
	vec3 castDir = rotateY(rotation.x) * rotateZ(rotation.y - (PI / 2.)) * localCast;
	SDFOut hit = march(worldPos, castDir);
	
	vec3 color = phongLight(hit, vec3(0), castDir);
	
	vec2 absPos = abs(position);
	
	if 
		(
			(absPos.x > 0.8 && absPos.x < 1. && absPos.y < 0.3) ||
			(absPos.y > 0.8 && absPos.y < 1. && absPos.x < 0.3) ||
			(min(absPos.x, absPos.y) > 0.8 && max(absPos.x, absPos.y) < 1.)
		) {
		color += vec3(0.1);
	}
	

	gl_FragColor = vec4( color, 1.0 );
}