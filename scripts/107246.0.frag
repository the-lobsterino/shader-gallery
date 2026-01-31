#ifdef GL_ES
precision mediump float;
#endif

#extension GL_OES_standard_derivatives : enable

uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;


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



void main( void ) {

	vec2 p = ( gl_FragCoord.xy*2. - resolution) / resolution.y ;

	vec3 camPos = vec3(0.,2.*sin(time),-time);
	
	vec3 ray = normalize(vec3(p,-1.));
	
	vec3 light = vec3(-1.,1.,1.);
	
	
	bool hit = false;
	
	float curDist = 0.;
	
	float rayLen = 0.;
	
	vec3 rayPos = camPos;
	
	
	for(int i=0;i<=132;i++){
		curDist = scene(rayPos);
		rayLen += curDist;
		
		rayPos = camPos + ray*rayLen;
		
		if(abs(curDist)<0.001){
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
	
	
	color = mix(backgoundColor, color, exp(-0.1*rayLen));
	
	
	gl_FragColor = vec4(color, 1.0 );

}