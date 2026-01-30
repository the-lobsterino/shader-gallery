#extension GL_OES_standard_derivatives : enable

precision mediump float;

uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;


#define DISTORTION_STRENGTH 32.0

mat2 rotate2D(float r){
    return mat2(cos(r), sin(r), -sin(r), cos(r));
}

// Distance of point p to cube #cubeNum
float distanceTo(vec3 p, float cubeNum) {
    float size = exp(-cubeNum) * 1.2;  // Cube size
    p.y += size*3.;  // Cube location, space out a bit
    return length(p-clamp(p, -size, size));
}

// Distance to closest cube
float minimumDist(vec3 p) {
    return distanceTo(p, 2.);
}

void mainImage( out vec4 fragColor, in vec2 fragCoord ) {
    float i = 0.;
    float eyeDist = 0., minDist;

    vec3 eyePos = vec3(0., 0., -1);
    vec3 ray = vec3((fragCoord.xy-.5*resolution.xy)/resolution.x, 1.);

    minDist=1.;
    for(int ii=0;ii<100;++ii) {  
        if (i>=100. || minDist<=.001) break;
        // Point to check
        vec3 p = eyePos+eyeDist*ray;
	    p.y -= 0.3;
        
        // Camera motion
        p.zy *= rotate2D(0.8);
	p.xz *= rotate2D(0.4);

        minDist = minimumDist(p);
        // Move point forward
        eyeDist += minDist*.25;

        i++;
    }
    // Adjust color by current distance to surface to fix banding
    i += minDist*4000.-4.;
    fragColor += 500.0/(i*i);
}

vec3 sampleColor(vec2 uv)
{
	if (uv.x < 0.0 || uv.y < 0.0 || uv.x > 1.0 || uv.y > 1.0) {
		return vec3(0.0);
	}
	uv = uv - 0.5;
	float r = length(uv);
	float theta = atan(-uv.y, -uv.x) / 6.283 + 0.5;
	return vec3(fract(floor(r * 16.0) / 8.0), floor(fract(theta) * 12.0) / 12.0, 0.0);
}


#define POLAR_UV_PADDING 0.0000005

vec2 linearToPolarUV(vec2 linearUV, vec2 centerPos) {
    linearUV.y = (linearUV.y - 0.5) * (1.0 + POLAR_UV_PADDING) + 0.5;
    float r = (exp(linearUV.x * 3.688) - 1.0) / 45.0;
    float theta = (linearUV.y + 0.5 * r) * 6.2831853;
    return clamp(vec2(r * cos(theta), r * sin(theta)) + centerPos, 0.0, 1.0);
}


vec2 polarToLinearUV(vec2 polarUV, vec2 centerPos) {
	polarUV = polarUV - centerPos;
    	float r = log(length(polarUV) * 45.0 + 1.0) / 3.688;
    	float theta = fract(atan(polarUV.y, polarUV.x) / 6.2831853 + 1.0 -0.5 * length(polarUV));
    	theta = (theta - 0.5) / (1.0 + POLAR_UV_PADDING) + 0.5;
	return vec2(r, theta);
}


bool getPairUV(vec2 uv, out vec2 outUV, out float outWeight)
{
    outUV = uv;	
	outWeight = 0.5;
	float heightScaled = 1.0 / (1.0 + POLAR_UV_PADDING);
	float margin = (1.0 - heightScaled) * 0.5;
    float theta2 = mod(uv.y + heightScaled, 2.0 * heightScaled);
    if (theta2 < 1.0) {
	    outWeight = (abs(uv.y - 0.5) - 0.5 * heightScaled) / margin + 1.0;
        outUV.y = theta2;
	   outUV.x = 0.0;
        return true;
    }
	
    return false;
}


void main( void ) {

	vec2 uv = ( gl_FragCoord.xy / resolution.xy );
	//uv = linearToPolarUV(uv, vec2(0.5, 0.5));
	//uv = polarToLinearUV(uv, vec2(0.45, 0.45));
	
	//vec2 uv2 = linearToPolarUV(uv, vec2(0.5, 0.5));
	//uv = mix(uv, uv2, fract(time *0.25));
	
    	mainImage(gl_FragColor, uv * resolution.xy);
	gl_FragColor = mix(gl_FragColor, vec4( sampleColor(uv), 1.0 ), 0.5);

}