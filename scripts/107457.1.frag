#extension GL_OES_standard_derivatives : enable

precision highp float;

uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;

#define PI 3.141592653589793
#define AA 2.0

vec3 repeat(vec3 p){

	return mod(p,4.) - 2.;
}

float smin( float a, float b, float k )
{
    float h = clamp( 0.5+0.5*(b-a)/k, 0.0, 1.0 );
    return mix( b, a, h ) - k*h*(1.0-h);
}

mat4 rotationMatrix(vec3 axis, float angle) {
    axis = normalize(axis);
    float s = sin(angle);
    float c = cos(angle);
    float oc = 1.0 - c;
    
    return mat4(oc * axis.x * axis.x + c,           oc * axis.x * axis.y - axis.z * s,  oc * axis.z * axis.x + axis.y * s,  0.0,
                oc * axis.x * axis.y + axis.z * s,  oc * axis.y * axis.y + c,           oc * axis.y * axis.z - axis.x * s,  0.0,
                oc * axis.z * axis.x - axis.y * s,  oc * axis.y * axis.z + axis.x * s,  oc * axis.z * axis.z + c,           0.0,
                0.0,                                0.0,                                0.0,                                1.0);
}

vec3 rotate(vec3 v, vec3 axis, float angle) {
	mat4 m = rotationMatrix(axis, angle);
	return (m * vec4(v, 1.0)).xyz;
}

float sphere(vec3 p){
	return length(p) - 1.;
}

float sdBox( vec3 p, vec3 b )
{
  vec3 d = abs(p) - b;
  return length(max(d,0.0))
         + min(max(d.x,max(d.y,d.z)),0.0); // remove this line for an only partially signed sdf 
}


float scene(vec3 p){
	vec3 p0 = repeat(p);
	vec3 p1 = rotate(p0,vec3(1.,1.,1.), time);
	float cube = sdBox(p1,vec3(0.5,0.5,0.5));
	float sphere = sphere(p0 - vec3(2.*mouse - 1.,0.));
	return smin(sphere,cube, 0.3);
}

vec3 getNormal(vec3 p){
	
	vec2 o = vec2(0.001,0.);
	// 0.001,0,0
	return normalize(
		vec3(
			scene(p + o.xyy) - scene(p - o.xyy),
			scene(p + o.yxy) - scene(p - o.yxy),
			scene(p + o.yyx) - scene(p - o.yyx)
		)
	);
}



vec3 texture(vec3 ray, vec3 camPos) {
	// vec3 camPos = vec3(0.,2.*sin(time),-time);
	
	vec3 light = vec3(-1.,1.,1.);
	
	
	bool hit = false;
	
	float curDist = 0.;
	
	float rayLen = 0.;
	
	vec3 rayPos = camPos;
	
	
	for(int i=0;i<=48;i++){
		curDist = scene(rayPos);
		rayLen += curDist;
		
		rayPos = camPos + ray*rayLen;
		
		if(abs(curDist)<0.01){
			hit = true;
			break;
		}
	}
	
	
	vec3 color = vec3(1.);
	
	if(hit){
		vec3 n = getNormal(rayPos);
		
		float diff = clamp(0.3,0.8,dot(light,n));
		color = vec3(diff);
	}
	
	vec3 backgoundColor = vec3(0.0, 0.0, 0.1);
	
	
	return mix(backgoundColor, color, exp(-0.1*rayLen));
}

vec3 tube(vec2 pos) {
	float angle = atan(pos.x / pos.y) / PI;
	
	if(angle < 0.0)
		angle += 1.0;
	
	if(pos.x < 0.0)
		angle += 1.0;
	
	vec2 uv = vec2(1.0 / length(pos), angle * 0.5 * 2.0 * PI);
	
	vec3 ray = normalize(vec3(sin(uv.y), cos(uv.y), -cos(time * 0.1) * 0.5 + 0.5));
	vec3 camPos = vec3(0.0, 0.0, uv.x + time);
	
	return mix(texture(ray, camPos), vec3(0.3, 0.2, 0.5), pow(clamp(1.004 - length(pos), 0.0, 1.0), 20.0));
}

vec3 colorFilter(vec3 color) {
	vec3 outColor = color * 0.95 + 0.05;
	
	outColor.r = pow(clamp(outColor.r, 0.0, 1.0), 1.2);
	outColor.g = pow(clamp(outColor.g, 0.0, 1.0), 1.1);
	outColor.b = pow(clamp(outColor.b, 0.0, 1.0), 1.0);
	
	return outColor;
}

void main( void ) {
	vec2 position = ( gl_FragCoord.xy - resolution.xy * 0.5 ) / min(resolution.x, resolution.y);
	
	vec3 color = vec3(0.0);
	
	for(float x = 0.0; x < float(AA); x++) {
		for(float y = 0.0; y < float(AA); y++) {
			color += tube(position + vec2(x, y) / float(AA) / min(resolution.x, resolution.y));
		}
	}
	
	color /= float(AA * AA);

	gl_FragColor = vec4( colorFilter(color), 1.0 );

}