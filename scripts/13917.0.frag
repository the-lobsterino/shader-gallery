#ifdef GL_ES
precision mediump float;
#endif

uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;

mat4 rotationMatrix(vec3 axis, float angle)
{
    axis = normalize(axis);
    float s = sin(angle);
    float c = cos(angle);
    float oc = 1.0 - c;
    
    return mat4(oc * axis.x * axis.x + c,           oc * axis.x * axis.y - axis.z * s,  oc * axis.z * axis.x + axis.y * s,  0.0,
                oc * axis.x * axis.y + axis.z * s,  oc * axis.y * axis.y + c,           oc * axis.y * axis.z - axis.x * s,  0.0,
                oc * axis.z * axis.x - axis.y * s,  oc * axis.y * axis.z + axis.x * s,  oc * axis.z * axis.z + c,           0.0,
                0.0,                                0.0,                                0.0,                                1.0);
	//http://www.neilmendoza.com/glsl-rotation-about-an-arbitrary-axis/
}

float f(float t, vec3 o, vec3 d) {
    float x = o.x + t * d.x;
    float y = o.y + t * d.y;
    float z = o.z + t * d.z;
	
	float start = pow((pow(x, 2.0) + (9.0/4.0) * pow(y, 2.0) + pow(z, 2.0) - 1.0), 3.0);
	float next = -pow(x, 2.0) * pow(z, 3.0) - (9.0/200.0) * pow(y, 2.0) * pow(z, 3.0);
	return start + next;
}

float root(vec3 o, vec3 d) {
	float t0 = 0.0;
	float t1 = 10.0;
	float t2 = 0.0;
	for (int i = 0; i < 40; i++) {
		float top = t0 * f(t1, o, d) - t1 * f(t0, o, d);
		float bottom = f(t1, o, d) - f(t0, o, d);
		if (bottom == 0.0) {
			bottom = 0.000000000001;
		}
		t2 = top / bottom;
		t0 = t1;
		t1 = t2;
	}
	return t2;
}

vec3 intersectionPos(vec3 o, vec3 d) {
	float t = root(o, d);
	if (t < -5.0) {
		return vec3(100.0, 100.0, 100.0);
	}
	return o + t * d;
}

vec3 gradient(vec3 pos) {
	float x = pos.x;
	float y = pos.y;
	float z = pos.z;
	
	float dx = 6.0 * pow( (pow(x, 2.0) + (9.0 / 4.0) * pow(y, 2.0) + pow(z, 2.0) - 1.0), 2.0 )
		* x - 2.0 * x * pow(z, 3.0);
	
	float dy = (27.0/2.0)*pow( (pow(x,2.0)+(9.0/4.0)*pow(y,2.0)+pow(z,2.0)-1.0), 2.0 )
		*y-(9.0/100.0)*y*pow(z, 3.0);
	
	float dz = 6.0*pow( (pow(x,2.0)+(9.0/4.0)*pow(y,2.0)+pow(z,2.0)-1.0), 2.0 )
		*z-3.0*pow(x,2.0)*pow(z, 2.0)-(27.0/200.0)*pow(y,2.0)*pow(z,2.0);
	
	return vec3(dx, dy, dz);
}

vec4 newcolor(vec4 color) {
	for (int i = 0; i < 3; i++) {
		float l = 2.0;
		int x = int(l * color[i]);
		color[i] = float(x) / l;
	}
	return color;
}

vec4 shade(vec3 pos, vec3 N, vec3 view) {
	vec3 lightDir = vec3(0, 1, 0);
	mat4 rot = rotationMatrix(vec3(0, 0, 1), time * 1.7);
	lightDir = (rot * vec4(lightDir, 0.0)).xyz;
	lightDir = normalize(lightDir);

	vec3 lightColor = vec3(1, 0, 0);
	vec3 specularColor = vec3(1, 1, 1);
	
	float NdotL = max(dot(N, lightDir), 0.0);
	
	vec3 diffuse = NdotL * lightColor;
	
	vec3 H = normalize(lightDir + view);
    vec3 specular = specularColor * pow(dot(N, H), 19.0);
	
	vec4 color = vec4((diffuse + specular), 1.0);
	color = newcolor(color);
	return color;
}

void main(void)
{
	float size = 4.0;
	size += mod(time / 4.0, 0.5);
	vec2 uv = gl_FragCoord.xy / resolution.xy - 0.5;
	uv.y = 0.7 * uv.y;
	uv = size * uv;
	vec3 cameraPos = vec3(0, 1.0, 0);
	vec3 uv2 = vec3(uv.x, 0.0, uv.y);
	
	vec3 rotAxis = vec3(0, 0, 1);
	vec3 rotAxis2 = vec3(1, 0, 0);
	//float angle = 0.5 * sin(time);
	//float angle2 = 0.5 * cos(time);
	float angle = 0.7 * time;
	float angle2 = 0.5 * sin(time);
	mat4 rot = rotationMatrix(rotAxis, angle);
	mat4 rot2 = rotationMatrix(rotAxis2, angle2);
	cameraPos = (rot * rot2 * vec4(cameraPos, 1.0)).xyz;
	
	vec3 rayDirection = vec3(0, -1, 0);
	rayDirection = normalize((rot * rot2 * vec4(rayDirection, 0.0)).xyz);
	uv2 = (rot * rot2 * vec4(uv2, 1.0)).xyz;
	
    vec3 rayOrigin = cameraPos + uv2;
	//rayOrigin.z +=  1.0 * sin(time);
	//rayOrigin.x +=  1.0 * cos(iGlobalTime);
	
	//rayDirection.z += 1.0 * sin(iGlobalTime);
	//rayDirection = normalize(rayDirection);

	vec3 pos = intersectionPos(rayOrigin, rayDirection);
	vec3 normal = normalize(gradient(pos));
	vec4 color;
	if (pos.x == 100.0)
		color = vec4(0, 0, 0, 1);
	else 
		color = shade(pos, normal, -rayDirection);
	
	gl_FragColor = color;
}