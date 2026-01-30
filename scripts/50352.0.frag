#ifdef GL_ES
precision mediump float;
#endif

#extension GL_OES_standard_derivatives : enable

uniform float time;
uniform vec2 resolution;
uniform vec2 mouse;

const int MAX_STEPS = 20;
const float THRESHOLD = 0.05;
float aspectRatio = resolution.y / resolution.x;

struct Hit {
    vec3 normal;
    vec3 path;
    float steps;
    float dist;
	vec3 col;
};

//Source http://www.iquilezles.org/www/articles/distfunctions/distfunctions.htm
//Basicalle everything is somehow adopted from iq's work
float opSmoothUnion( float d1, float d2, float k ) {
    float h = clamp( 0.5 + 0.5*(d2-d1)/k, 0.0, 1.0 );
    return mix( d2, d1, h ) - k*h*(1.0-h);
}

float opSmoothSubtraction( float d1, float d2, float k ) {
    float h = clamp( 0.5 - 0.5*(d2+d1)/k, 0.0, 1.0 );
    return mix( d2, -d1, h ) + k*h*(1.0-h);
}

float opSmoothIntersection( float d1, float d2, float k ) {
    float h = clamp( 0.5 - 0.5*(d2-d1)/k, 0.0, 1.0 );
    return mix( d2, d1, h ) + k*h*(1.0-h);
}

float sdSphere(vec3 p, vec3 pos, float radius)
{
	vec3 p1 = vec3(p) + pos;
	return length(p1) - radius;
}


float sdCylinder(vec3 p, vec3 pos, vec3 c )
{
	vec3 p1 = p + pos;
	return length(p1.xz-c.xy)-c.z;
}

float sdMandleBox(vec3 path, vec3 pos, float size, float scale, float minrad, float limit, float c)
{
    const int Iterations = 14;
    const float FoldingLimit = 200.0;

    vec4 scalev = vec4(size) / minrad;
    float AbsScalem1 = abs(scale - 1.0);
    float AbsScaleRaisedTo1mIters = pow(abs(scale), float(1 - Iterations));
   vec4 p = vec4(path, 1.0), p0 = p;  // p.w is the distance estimate
   
   for (int i=0; i<Iterations; i++)
   {
      p.xyz = clamp(p.xyz, -limit, limit) * c - p.xyz;
      float r2 = dot(p.xyz, p.xyz);
      p *= clamp(max(minrad / r2, minrad), 0.2, 4.0);
      p = p * scalev + p0;
      if (r2>FoldingLimit) break;
   }
   return ((length(p.xyz) - AbsScalem1) / p.w - AbsScaleRaisedTo1mIters);
}

vec3 rotX(vec3 p, float a)
{
    float s = sin(a);
    float c = cos(a);
    return vec3(
        p.x,
        c*p.y-s*p.z,
        s*p.y+c*p.z
    );
}

vec3 rotY(vec3 p, float a)
{
    float s = sin(a);
    float c = cos(a);
    return vec3(
        c*p.x+s*p.z,
        p.y,
        -s*p.x+c*p.z
    );
}
 

vec3 rotZ(vec3 p, float a)
{
    float s = sin(a);
    float c = cos(a);
    return vec3(
        c*p.x-s*p.y,
        s*p.x+c*p.y,
        p.z
    );
}

vec3 repeat(vec3 p, vec3 c) {
    vec3 path1 = mod(p, c) - 1.5 * c;
    return path1;
}

float sphere_distance(vec3 p)
{
    return length(p - vec3(1.5, -1.8, 4.0)) - 1.2;
}

vec4 sphere_material(vec3 p)
{
    vec4 mat = vec4(0.1, 0.2, 0.0, 1.0);
    return mat;
}

struct mat {
	float dist;
	vec3 color;
};

mat scenes(vec3 path)
{
	mat material;
	vec3 path1 = repeat(path, vec3(8.2, 0.0, 0.0));
	vec3 pathr1 = rotX(path1, time / 5.5);   
	float d1 = sdSphere(pathr1, vec3(0.0, 0.0, 0.0), (5.2));
	float d4 = sdMandleBox(pathr1, vec3(0.0), 1.2, 1.8, 0.109, 1.0, 1.56);
	float d14 = opSmoothSubtraction(d1, d4, 0.5);
	
	vec3 path2 = repeat(path, vec3(5.0, 0.0, 0.0));
	vec3 pathr2 = rotX(path2, -time / 5.5);
	vec3 wallPath = pathr2 / 3.0;
	float d2 = sdCylinder(rotZ(wallPath, 1.5708), vec3(0.0, 0.0, 0.0), vec3(0.0, 0.0, 3.0)) * 4.0;
	float d6 = sdMandleBox(wallPath, vec3(0.0), 1.2, 1.7, 0.101, 1.0, 1.96) * 3.0;
	float d26 = opSmoothSubtraction(d2, d6, 2.5);
	
	if (min(d26, d14) == d14) {
		material.color = vec3(0.5, 0.0, 0.0); 
		material.dist = d14;
	}
	else {
		material.color = vec3(0.0, 0.0, 0.5);
		material.dist = d26;
	}
	return  material;
}


Hit raymarch(vec3 rayOrigin, vec3 rayDirection) {
   
    const vec3 eps = vec3(0.01, 0.0, 0.0);

    Hit h;
    h.steps = -1.0;

    for(int i = 0; i <= MAX_STEPS; i++) {
        h.path = rayOrigin + rayDirection * h.dist;
        mat d = scenes(h.path);
        h.steps += 1.0;
        if(d.dist < THRESHOLD) {
            h.normal = normalize(vec3(
                scenes(h.path + eps.xyy).dist - scenes(h.path - eps.xyy).dist,
                scenes(h.path + eps.yxy).dist - scenes(h.path - eps.yxy).dist,
                scenes(h.path + eps.yyx).dist - scenes(h.path - eps.yyx).dist
            ));
 
            break;
        }
        h.dist += d.dist;
	    h.col = d.color;

    }
    
    return h;
}


vec3 ambient(vec3 color, float strength) {
    return color * strength;
}

vec3 diffuse(vec3 norm, vec3 pos, vec3 color, float strength) {
    float diff = max(dot(norm, pos), 0.0);
    vec3 diffuse = diff * color * strength;
    return diffuse;
}

vec3 specular(vec3 norm, vec3 eye, vec3 hit, vec3 pos, vec3 color, float strength, float power) {
    vec3 eyeToHit = normalize(eye - hit);
    vec3 reflectDir = reflect(-pos, norm);
    float spec = pow(max(dot(eyeToHit, reflectDir), 0.0), power);
    vec3 specular = strength * spec * color; 
    return specular;
}


vec4 processColor(Hit h, vec3 color, vec3 rd, vec3 eye, vec2 uv, vec3 lightPos, float alpha)
{
    vec3 c = h.col;
	/*float apustaja = smoothstep(1.0, 50.0, h.dist);
	apustaja = clamp(apustaja, 0.0, 0.5);
	c = vec3(apustaja, (0.6-apustaja), (0.6-apustaja));*/
	
    vec3 fog = vec3(smoothstep(0.0, 95.0, h.dist));
    vec3 ambient = ambient(vec3(0.5, 0.5, 0.5), 0.05);
    vec3 diffuse = diffuse(h.normal, lightPos, vec3(0.5, 0.5, 0.5), 0.07);
    vec3 specular = specular(h.normal, eye, h.path, lightPos, vec3(1.0, 1.0, 1.0), .003, 1.09);
    vec3 result = (ambient + diffuse + specular) + c;
    return vec4(result + fog, alpha);
}
 
void main(void)
{
    float aspectRatio = resolution.y / resolution.x;

    vec2 uv = (gl_FragCoord.xy / resolution) - 0.5;
    uv.x /= aspectRatio;
    float fov = 1.0;
    
    vec3 cPos = vec3(time, 0.0, 0.0);
    vec3 cDir = vec3(10000.0, -sin(time) * 620.0, cos(time) * 225.0);
	vec3 lPos = vec3(0.0, 10.0, 1.0);
    vec3 color = vec3(0.4, 0.0, 0.0);
    vec3 forward = normalize(cDir - cPos); 
    vec3 right = normalize(vec3(forward.z, 0.0, -forward.x)); 
    vec3 up = normalize(cross(forward, right)); 

    vec3 rd = normalize(forward + fov * uv.x * right + fov * uv.y * up);
    
    vec3 ro = vec3(cPos);
    Hit tt = raymarch(ro, rd);
    gl_FragColor = processColor(tt, color, rd, ro, uv, lPos, 1.0); 

}