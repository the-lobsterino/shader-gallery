/*
 * Original shader from: https://www.shadertoy.com/view/3tXXzX
 */


#ifdef GL_ES
precision mediump float;
#endif

// glslsandbox uniforms
uniform float time;
uniform vec2 resolution;

// shadertoy emulation
#define iTime (time/10.)
#define iResolution resolution

// --------[ Original ShaderToy begins here ]---------- //
#define Pi 3.14159265359
#define ShadowStepSize 1.75
#define CameraStepSize .5
#define Anisotropy .2
#define ViewStart 1.8
#define ViewEnd 4.2

vec3 DirCam = vec3(-1, 0, 0);
vec3 PosCam = vec3(3.0, 0, .0);
float FocalLength = 1.0;

vec3 LightDir = normalize(vec3(-1));
vec3 LightColor = vec3(2.5);

float Density = 50.0;
vec3 ShapeColor = vec3(.1, .15, .2);


vec3 powV(vec3 v, float p){
    return vec3(pow(v.x, p), pow(v.y, p), pow(v.z, p));
}

float maxV(vec3 v){
    return max(max(v.x, v.y), v.z);
}

float insideShape2(vec3 pos, float Power) {
	vec3 z = pos;
	float r;
	float zr;
    float sinTheta;
    float phi;
    float theta;
	for(int i = 0; i < 4; i++) {
		r = length(z);
		if(r>1.3) break;
		theta = acos(z.z/r)*Power;
		phi = atan(z.y,z.x)*Power;
        sinTheta = sin(theta);
		z = pow(r,Power)*vec3(sinTheta*vec2(cos(phi), sin(phi)), cos(theta)) + pos;
	}
	return r;
}
uniform vec2 mouse;
float insideShape(vec3 pos){
	float r = insideShape2(pos, 4.+sin(time/4.321));
	for(float i = 0.0; i <= 7.; i += 1.00001){
		r = min(r, insideShape2(pos, 2.*(1.+i*2.)+i*2.*cos(i*i+time/7.+pos.x)));
	}
	return mix(0.5+length(r), r, 1./resolution.x);
}

float henyeyGreenstein(vec3 dir){
	float cosTheta = dot(dir, -LightDir);
 	return Pi/4.0 * (1.0-Anisotropy*Anisotropy) / pow(1.0 + Anisotropy*Anisotropy - 2.0*Anisotropy*cosTheta, 3.0/2.0);
}

vec3 lightReceived(vec3 pos){
    vec3 absorption = vec3(1.0);
    for(int i = 0; i < 32; i++){
        if(insideShape(pos)<=1.){
            absorption *= powV(vec3(1)-ShapeColor, ShadowStepSize);
        }
        pos -= LightDir * ShadowStepSize/Density;
        if(pos.x*pos.x+pos.y*pos.y+pos.z*pos.z > 1.7) break;
    }
    return absorption * LightColor;
}

vec3 rayColor(vec3 pos, vec3 dir){
    float hg = henyeyGreenstein(dir);
    vec3 color = vec3(0.0);
    vec3 absorption = vec3(1.0);
    for(int i = 0; i < 256; i++){
        if(insideShape(pos)<=1.){
            vec3 lr = lightReceived(pos);
            color += ShapeColor*absorption*lr*hg*CameraStepSize;
            absorption *= powV(vec3(1)-ShapeColor, CameraStepSize);
        }
        pos += dir * CameraStepSize/Density;
        if(maxV(absorption) < .3 || float(i)*CameraStepSize/Density > ViewEnd) break;
    }
    return color;
}

vec4 projectRay(vec2 posOnScreen){
    
	vec3 camX = vec3(-DirCam.y, DirCam.x, 0);
	vec3 camY = cross(camX, DirCam);
	vec3 sensorX = camX * (posOnScreen.x/length(camX));
	vec3 sensorY = camY * (posOnScreen.y/length(camY));
	vec3 centerSensor = PosCam - DirCam * FocalLength;
	vec3 posOnSensor = centerSensor + sensorX + sensorY;
	vec3 newDir = normalize(PosCam - posOnSensor);
	
    vec3 color = rayColor(PosCam + newDir*ViewStart, newDir);
	return vec4(log(color + vec3(1.0)), 1.0);	//reduces clipping and desaturates bright colors
}


vec3 rotateZ(vec3 p, float angle){
    return vec3(cos(angle) * p.x + sin(angle) * p.y,
                -sin(angle) * p.x + cos(angle) * p.y,
                p.z);
}


void mainImage( out vec4 fragColor, in vec2 fragCoord ) {
    
    //quick animation ...
    DirCam = rotateZ(DirCam, -iTime/3.0);
    PosCam = rotateZ(PosCam, -iTime/3.0);
    
    vec2 uv = (fragCoord.xy - iResolution.xy/2.0)/iResolution.y;
    fragColor = projectRay(uv);
}
// --------[ Original ShaderToy ends here ]---------- //

void main(void)
{
    mainImage(gl_FragColor, gl_FragCoord.xy);
}