#ifdef GL_ES
precision mediump float;
#endif

#extension GL_OES_standard_derivatives : enable

uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;

mat4 PerspectiveFov(float fov, float aspect, float zNear, float zFar)
{
    float h = cos(fov / 2.0) / sin(fov / 2.0);
    float w = h * aspect;
    mat4 m = mat4(0.0);
    m[0][0] = w;
    m[1][1] = h;
    m[2][2] = - (zFar + zNear)/(zFar - zNear);
    m[2][3] = - 1.0;
    m[3][2] = - (2.0*zFar*zNear)/(zFar - zNear);
    return m;
}

mat4 CreateTransform(float x, float y, float z){
   mat4 translate = mat4(0.0);
	translate[0][0] = 1.0;
	translate[1][1] = 1.0;
	translate[2][2] = 1.0;
	translate[3][3] = 1.0;
	translate[3][0] = x;
	translate[3][1] = y;
	translate[3][2] = z;
	return translate;
}

mat4 Rotate(in vec3 v, in float angle){
	 float c = cos(angle);
            float s = sin(angle);
        
            vec3 axis = normalize(v);
            vec3 temp = (1.0 - c) * axis;
        
            mat4 m = mat4(0.0);
	m[0][0] = 1.0;
	m[1][1] = 1.0;
	m[2][2] = 1.0;
	m[3][3] = 1.0;
            m[0][0] = c + temp.x * axis.x;
            m[0][1] = 0.0 + temp.x * axis.y + s * axis.z;
            m[0][2] = 0.0 + temp.x * axis.z - s * axis.y;
        
            m[1][0] = 0.0 + temp.y * axis.x - s * axis.z;
            m[1][1] = c + temp.y * axis.y;
            m[1][2] = 0.0 + temp.y * axis.z + s * axis.x;
        
            m[2][0] = 0.0 + temp.z * axis.x + s * axis.y;
            m[2][1] = 0.0 + temp.z * axis.y - s * axis.x;
            m[2][2] = c + temp.z * axis.z;
	return m;
}

vec4 mod289(vec4 x)
{
    return x - floor(x * (1.0 / 289.0)) * 289.0;
}
 
vec4 permute(vec4 x)
{
    return mod289(((x*34.0)+1.0)*x);
}
 
vec4 taylorInvSqrt(vec4 r)
{
    return 1.79284291400159 - 0.85373472095314 * r;
}
 
vec2 fade(vec2 t) {
    return t*t*t*(t*(t*6.0-15.0)+10.0);
}
 
// Classic Perlin noise
float cnoise(vec2 P)
{
    vec4 Pi = floor(P.xyxy) + vec4(0.0, 0.0, 1.0, 1.0);
    vec4 Pf = fract(P.xyxy) - vec4(0.0, 0.0, 1.0, 1.0);
    Pi = mod289(Pi); // To avoid truncation effects in permutation
    vec4 ix = Pi.xzxz;
    vec4 iy = Pi.yyww;
    vec4 fx = Pf.xzxz;
    vec4 fy = Pf.yyww;
     
    vec4 i = permute(permute(ix) + iy);
     
    vec4 gx = fract(i * (1.0 / 41.0)) * 2.0 - 1.0 ;
    vec4 gy = abs(gx) - 0.5 ;
    vec4 tx = floor(gx + 0.5);
    gx = gx - tx;
     
    vec2 g00 = vec2(gx.x,gy.x);
    vec2 g10 = vec2(gx.y,gy.y);
    vec2 g01 = vec2(gx.z,gy.z);
    vec2 g11 = vec2(gx.w,gy.w);
     
    vec4 norm = taylorInvSqrt(vec4(dot(g00, g00), dot(g01, g01), dot(g10, g10), dot(g11, g11)));
    g00 *= norm.x;  
    g01 *= norm.y;  
    g10 *= norm.z;  
    g11 *= norm.w;  
     
    float n00 = dot(g00, vec2(fx.x, fy.x));
    float n10 = dot(g10, vec2(fx.y, fy.y));
    float n01 = dot(g01, vec2(fx.z, fy.z));
    float n11 = dot(g11, vec2(fx.w, fy.w));
     
    vec2 fade_xy = fade(Pf.xy);
    vec2 n_x = mix(vec2(n00, n01), vec2(n10, n11), fade_xy.x);
    float n_xy = mix(n_x.x, n_x.y, fade_xy.y);
    return 2.3 * n_xy;
}
 
// Classic Perlin noise, periodic variant
float pnoise(vec2 P, vec2 rep)
{
    vec4 Pi = floor(P.xyxy) + vec4(0.0, 0.0, 1.0, 1.0);
    vec4 Pf = fract(P.xyxy) - vec4(0.0, 0.0, 1.0, 1.0);
    Pi = mod(Pi, rep.xyxy); // To create noise with explicit period
    Pi = mod289(Pi);        // To avoid truncation effects in permutation
    vec4 ix = Pi.xzxz;
    vec4 iy = Pi.yyww;
    vec4 fx = Pf.xzxz;
    vec4 fy = Pf.yyww;
     
    vec4 i = permute(permute(ix) + iy);
     
    vec4 gx = fract(i * (1.0 / 41.0)) * 2.0 - 1.0 ;
    vec4 gy = abs(gx) - 0.5 ;
    vec4 tx = floor(gx + 0.5);
    gx = gx - tx;
     
    vec2 g00 = vec2(gx.x,gy.x);
    vec2 g10 = vec2(gx.y,gy.y);
    vec2 g01 = vec2(gx.z,gy.z);
    vec2 g11 = vec2(gx.w,gy.w);
     
    vec4 norm = taylorInvSqrt(vec4(dot(g00, g00), dot(g01, g01), dot(g10, g10), dot(g11, g11)));
    g00 *= norm.x;  
    g01 *= norm.y;  
    g10 *= norm.z;  
    g11 *= norm.w;  
     
    float n00 = dot(g00, vec2(fx.x, fy.x));
    float n10 = dot(g10, vec2(fx.y, fy.y));
    float n01 = dot(g01, vec2(fx.z, fy.z));
    float n11 = dot(g11, vec2(fx.w, fy.w));
     
    vec2 fade_xy = fade(Pf.xy);
    vec2 n_x = mix(vec2(n00, n01), vec2(n10, n11), fade_xy.x);
    float n_xy = mix(n_x.x, n_x.y, fade_xy.y);
    return 2.3 * n_xy;
}

void main( void ) {

	  vec3 LIGHTS[4];
	float t = 0.0;
	float dist = 2.0;
	LIGHTS[0] = vec3(sin(4.0+t+time)*dist,cos(3.0+t+time) * dist,dist);t++;
	LIGHTS[1] = vec3(sin(9.0+t+time)*dist,cos(5.0+t+time) * dist,dist);t++;
	LIGHTS[2] = vec3(sin(7.0+t+time)*dist,cos(7.0+t+time) * dist,dist);t++;
	LIGHTS[3] = vec3(sin(3.0+t+time)*dist,cos(3.0+t+time) * dist,dist);t++;
	
	mat4 perspective = PerspectiveFov(70.0/180.0*3.1415925, resolution.x/resolution.y, 0.01,99.0);
	mat4 modelMatrix = CreateTransform(sin(time)*0.2,cos(time)*0.2,0.0);
	modelMatrix = modelMatrix * Rotate(vec3(0.0,1.0,0.0), time);
	mat4 modelViewProjectionMatrix = perspective * modelMatrix;
	vec2 fragPos = ( gl_FragCoord.xy / resolution.xy );
	
	vec4 tmp = modelViewProjectionMatrix * vec4(fragPos, 0.0, 1.0);
	float fx = resolution.x;
	if(fx < resolution.y){
		fx = resolution.y;
	}
	vec2 fixedPosition = gl_FragCoord.xy / vec2(fx);
	vec2 pixelSize = vec2(1.0) / resolution.xy;
	float centerDist = distance(fixedPosition, vec2(0.5,0.3333));
	float color = smoothstep(0.25, pixelSize.y+0.25, centerDist);
	vec3 result = vec3(0.0);
	float x = sin((fixedPosition.x - 0.5) * 3.14159);
	float y = sin((fixedPosition.y - 0.3333) * 3.14159);
	float z = cos(centerDist * 3.14159);
	float lR = 1.0;
	vec3 positionNormal = vec3(x,y,z) * (1.0-color);
	for(int i = 0; i < 4; i++){
		vec3 lightPos = LIGHTS[i];
		vec3 eye = vec3(0.0,0.0,3.0);
		float d = distance(lightPos,positionNormal);
		vec3 eyeToWorld = normalize(positionNormal-eye);
		vec3 lightDir = normalize(lightPos - positionNormal);
		float diffuse = dot(lightDir, positionNormal) * 0.5 * max(0.0,dist*0.8/d);
		float specular = max(0.0,min(1.0, dot(eyeToWorld, normalize(reflect(lightPos, positionNormal)))));
		specular = pow(specular,60.0);
		float c = diffuse + specular;
		lightPos = normalize(lightPos);
		result += vec3(c*lightPos.x,c*lightPos.y,c*lightPos.z);
	}
	float noiseX = pnoise(gl_FragCoord.xy/70.+vec2(time,time),vec2(5.0,5.0));
	noiseX = noiseX * smoothstep(0.6,0.9,(1.0 - distance(fragPos, vec2(0.5,0.5))));
	float noiseX1 = pnoise((gl_FragCoord.xy+vec2(1.0,0.0))/70.+vec2(time,time),vec2(5.0,5.0));
	noiseX1 = noiseX1 * smoothstep(0.6,0.9,(1.0 - distance(fragPos, vec2(0.5,0.5))));
	float noiseY1 = pnoise((gl_FragCoord.xy+vec2(0.0,1.0))/70.+vec2(time,time),vec2(5.0,5.0));
	noiseX1 = noiseY1 * smoothstep(0.6,0.9,(1.0 - distance(fragPos, vec2(0.5,0.5))));
	float newNormalX = (noiseX-noiseX1)*10.;
	float newNormalY = (noiseX-noiseY1)*10.;
	gl_FragColor = vec4( newNormalX,0.0,0.0, 1.0 );

}