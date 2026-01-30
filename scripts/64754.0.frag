/*
 * Original shader from: https://www.shadertoy.com/view/wsV3Dc
 */

#ifdef GL_ES
precision mediump float;
#endif

// glslsandbox uniforms
uniform float time;
uniform vec2 resolution;

// shadertoy emulation
#define iTime time
#define iResolution resolution

// --------[ Original ShaderToy begins here ]---------- //
const vec3 ConstBackGroundCol = vec3(.25);
const float ConstBodyBorderSize = .2;
const float ConstEyesBodyRatio = .3;
const vec2 ConstEyeLoc = vec2(.35, .25);
const float ConstIrisEyeRatio = .4;

const vec3 ConstBodyColor = vec3(0.);
const vec3 ConstEyesColor = vec3(1.);
const vec3 ConstIrisColor = vec3(0.);
const vec3 ConstAngryEyesColor = vec3(1., 0., 0.);
const vec3 ConstAngryIrisColor = vec3(.5, .0, 1.);

const float PI = 2.*asin(1.);

vec2 polar(in vec2 p) {
    float dist = length(p);
    float teta = dist > .0 ? asin(p.y/dist) : .0;	// -Pi/2 -> Pi/2
    if(p.x < .0)
    	teta = 3.14 - teta;
    
    return vec2(dist, teta);
}    

float smoothPeriodicEvent(in float period, in float duration, in float timeOffset) {
    float val = fract((iTime + timeOffset) / period);
    val = smoothstep(.0, duration/period, val);	// _.-°¨¨¨¨¨¨|_.-°¨¨¨¨¨¨|_ [...]
    val = 2.*abs(val-.5);						// ¨\_/¨¨¨¨¨¨¨¨\_/¨¨¨¨¨¨¨¨ [...]
    val = 1.-val;								// _/¨\________/¨\________ [...]
    
    return val;
}             

float hcos(float v) {
    // Note: approximation of bad/cool rendering cos of too high value on some chip CG
    float d = sign(mod(v, 2.*PI)/PI - 1.)
        	* max(0., fract(mod(v, PI)/PI/0.65 - 7./13.)-.3)/.7;
    return cos(PI/2. * (1.- d));
}

void mainImage( out vec4 fragColor, in vec2 fragCoord )
{
    // Normalized pixel coordinates
    vec2 uv = 4.*(2.*fragCoord - iResolution.xy)/iResolution.y;

    float hashedTime = 10000.+iTime;
    
    // tiling
    float idY = floor(uv.y/2. + .5);
    uv.x -= .5*idY;
    vec2 id = vec2(floor(uv/2. + .5));
    uv -= 2.*id ;
    
    vec3 col = ConstBackGroundCol;
    
    // angry one - sometime
    float angry = smoothPeriodicEvent(30., 3., id.x*id.y + 2. * 5.*id.x - 7.*id.y);
    if(angry >.0) {
        vec2 rumble = .05*angry*vec2(cos((1000.*iTime)), sin(1200.*iTime));
        uv+=rumble;
    }
    
    // body size ~= 1. (+-cos +-sin)
    {
		vec2 pol = polar(uv);
        float bsize = pol.x
            + ConstBodyBorderSize / 10.0 *
            	(   hcos(pol.y * 10. + 2. * iTime)
                  - hcos(pol.y * 7. - 1.5 * iTime));
        float b = smoothstep(1.-ConstBodyBorderSize, 1., bsize);
        if(b < 1.) col = mix(ConstBodyColor, ConstBackGroundCol, b);
    }
    
    // eyes
    {
        vec2 eyeMove = vec2(.0);
        vec2 eyeLoc = ConstEyeLoc + eyeMove;
        
        vec2 rightLeftCorrection = vec2(1.);
        if(uv.x < .0) rightLeftCorrection.x = -1.;
        vec2 correctedEyeLoc = eyeLoc * rightLeftCorrection;
        
        vec2 normalizedEyeUv = (uv - correctedEyeLoc) / ConstEyesBodyRatio;
        vec2 pol = polar(normalizedEyeUv);

        float e = smoothstep(.7, 1., pol.x);
        if(e < 1.)
        {
            // in the eye
            vec3 eyesColor = ConstEyesColor;
            if(angry>.0) eyesColor = mix(eyesColor, ConstAngryEyesColor, angry);
            col = mix(eyesColor, col, e);
            
            // iris
            {
            	vec2 irisLoc = eyeLoc;//+ 0.5*vec2(.03 * cos(iTime), .02 * sin(iTime));
                vec2 normalizedIrisUv = (uv - irisLoc * rightLeftCorrection) / (ConstIrisEyeRatio*ConstEyesBodyRatio);
                pol = polar(normalizedIrisUv);
            	e = smoothstep(.6, 1.2, pol.x);
                vec3 irisColor = ConstIrisColor;
                if(angry>.0) irisColor = mix(irisColor, ConstAngryIrisColor, angry);
                if(e < 1.) col = mix(irisColor, col, e);
            }
            
            // eyelid
            {
                float closing = 1.-smoothPeriodicEvent(10., .2, 10.*(sin(30.* id.x) + .5*cos(10.*id.y)));
                
                vec2 lidLoc = eyeLoc;
        		vec2 correctedLidLoc = lidLoc * rightLeftCorrection;
        		vec2 normalizedLidUv = (uv - correctedLidLoc) / ConstEyesBodyRatio;
                vec2 ellipsoidLidUv = normalizedLidUv * vec2(1., 1./closing);
                float b = 1.-smoothstep(1., 1.05, length(ellipsoidLidUv));
				if(b<1.) col*=b;
            }
        }
    }
    
    
    // Output to screen
    fragColor = vec4(col,1.0);
}
// --------[ Original ShaderToy ends here ]---------- //

void main(void)
{
    mainImage(gl_FragColor, gl_FragCoord.xy);
}