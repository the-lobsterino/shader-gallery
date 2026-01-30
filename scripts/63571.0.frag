/*
 * Original shader from: https://www.shadertoy.com/view/ld2yDR
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
void mainImage( out vec4 fragColor, in vec2 fragCoord )
{
    
    //Aspect ratio of screen
    float aspect = iResolution.y / iResolution.x;
    //Uv coord
	vec2 uv = fragCoord.xy / iResolution.xy;
    //Centered
    uv = uv * 2. - 1.;
    //Aspect ratio fix
    uv.y *= aspect;
    
    //Circle mask
    float circle = smoothstep(length(uv), length(uv)+0.005, 0.5);
    
    //Colors
    const vec3 red = vec3(0.89, 0.27, 0.18);
    const vec3 green = vec3(0.5, 0.72, 0.2);
    const vec3 blue = vec3(0.26, 0.64, 0.85);
    const vec3 mint = vec3(0.22, 0.82, 0.4);
    const vec3 orange = vec3(0.96, 0.7, 0.18);
    vec3 white = mix(blue, vec3(1., 1., 1.), length(vec2(5.0, -5.0) - uv * 2.) * 0.135);
    const vec4 bgCol = vec4(0.13,0.2,0.282,1);
    
    //Because sin is a bastard
    const float PI = 3.14159265;
	
    //Base height of waves
    const float waveBaseline = -0.25;
    
    //Phase of the sine wave, to allow tiling phase modulation
    float heightPhase = sin(mod(iTime * 0.35, 0.5*PI)) * PI;
    //increased phase mod for wave speed
    float phase = heightPhase * 16.;
    
    //Height of the waves controlled by phase modulation
	float waveHeight = 0.2 * (1.-(sin(2.0*PI + heightPhase) * 0.5 + 0.5));
	
    //The red wave
    vec4 redWave;
    float redWaveform = sin(2.0*PI*uv.x * 0.7 + phase - 1.1);//sin(5.3 + iTime * 0.75 + uv.x * 4.);
    redWave.rgb = red;
    redWave.a = smoothstep(uv.y + redWaveform * waveHeight, uv.y + redWaveform * waveHeight + 0.005, waveBaseline);
    
    //The blue wave
    vec4 blueWave;
    float blueWaveform = sin(2.0*PI*uv.x * 1.15 + phase - 0.6);
    blueWave.rgb = blue;
    blueWave.a = smoothstep(uv.y + blueWaveform * waveHeight, uv.y + blueWaveform * waveHeight + 0.005, waveBaseline);
    
    //The green wave
    vec4 greenWave;
    float greenWaveform = sin(2.0*PI*uv.x * 2.0 + phase);
    greenWave.rgb = green; 
    greenWave.a = smoothstep(uv.y + greenWaveform * waveHeight, uv.y + greenWaveform * waveHeight + 0.005, waveBaseline);
    
    //Combine waves
    vec4 waveComp = mix(bgCol, redWave, redWave.a);
    waveComp = mix(waveComp, blueWave, blueWave.a);
    waveComp = mix(waveComp, greenWave, greenWave.a);
    
    //Overlap between green and blue
    float mintSection = smoothstep( 1.99, 2.0, greenWave.a + blueWave.a);
    waveComp = mix(waveComp, vec4(mint, 1.0), mintSection);
    
    //Overlap between red and green
    float orangeSection = smoothstep(1.99, 2.0, greenWave.a + redWave.a - blueWave.a);
    waveComp = mix(waveComp, vec4(orange.rgb, 1.0), orangeSection);
   
    //Overlap between all
    float whiteSection = smoothstep(2.2, 3.0, greenWave.a + redWave.a + blueWave.a);
    waveComp = mix(waveComp, vec4(white, 1.0), whiteSection);
    
    //Lighthouse
    vec2 LHPos = vec2(0.086, -0.1);
	vec2 _uv = uv;
	uv.x = abs(uv.x)-0.15;
    LHPos.y = mix(-0.05, -0.1, sin(iTime) * 0.5 + 0.5);
    float leftTopPlane = smoothstep((LHPos.x + uv.x) * -4. + (LHPos.y + uv.y) * 5., 0.02 +(LHPos.x + uv.x) * -4. + (LHPos.y + uv.y) * 5., 1.);
	float rightTopPlane = smoothstep((LHPos.x + uv.x) * 4. + (LHPos.y + uv.y) * 5., 0.02 + (LHPos.x + uv.x) * 4. + (LHPos.y + uv.y) * 5., 1.7);
    float middleSplit = step(uv.x, 0.0);
    float leftSidePlane = smoothstep((LHPos.x + uv.x) * -30. + (LHPos.y + uv.y) * 5., 0.15 + (LHPos.x + uv.x) * -30. + (LHPos.y + uv.y) * 5., 0.4);
    float rightSidePlane = smoothstep((LHPos.x + uv.x) * 30. + (LHPos.y + uv.y) * 5., 0.15 + (LHPos.x + uv.x) * 30. + (LHPos.y + uv.y) * 5., 5.65);
    float LHMask = leftSidePlane * leftTopPlane * rightTopPlane * rightSidePlane;
    LHMask *= clamp(uv.y * 2.5 + 0.5, 0., 1.);
    float grad1 = uv.y * 0.75 + 0.3;
    float grad2 = 1.3 * (uv.y * 0.75 + 0.4);
    float LH = mix(grad1, grad2, middleSplit) * LHMask;
	uv = _uv;
    //Final comp
    vec4 comp = mix(vec4(1,1,1,1), waveComp, circle);
	fragColor = comp + LH;
}
// --------[ Original ShaderToy ends here ]---------- //

void main(void)
{
    mainImage(gl_FragColor, gl_FragCoord.xy);
}