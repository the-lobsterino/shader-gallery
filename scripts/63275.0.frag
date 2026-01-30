#ifdef GL_ES
precision mediump float;
#endif

// glslsandbox uniforms
uniform float time;
uniform vec2 resolution;

// shadertoy emulation
#define iTime time
#define iResolution resolution

// Emulate a black texture
#define texture(s, uv) vec4(0.0)

// --------[ Original ShaderToy begins here ]---------- //
#define speed (25.2)
#define k2PI (2.*3.14159265359)
#define kStarDensity .011
#define kMotionBlur 0.4
#define kNumAngles 90. + sin(iTime)*30.
 

void mainImage( out vec4 fragColor, in vec2 fragCoord )
{
    vec2 mouse = vec2(sin(iTime) / 5.5 + .5, sin (2.5 * iTime) + .5);
    vec2 position = ( fragCoord.xy -  iResolution.xy*.5 ) / iResolution.x; // use this for mouse panning
    position -= .3*(mouse - 0.5)* vec2 (2., iResolution.y / iResolution.x);
    float A = atan(position.y,position.x);
    float angle0 = A / k2PI;
    float angle = fract(angle0 + .002*iTime);
    float rad = .3*length(position);
    float angleFract = fract(angle*kNumAngles);
    float angleStep = floor(angle*kNumAngles);
    float angleToRandZ = 10.*fract(angleStep*fract(angleStep*.7535)*45.1);
    float angleSquareDist = fract(angleStep*fract(angleStep*.82657)*13.724);
    float t = speed * iTime - angleToRandZ;
    float angleDist = (angleSquareDist+0.1);
    float adist = angleDist/rad*kStarDensity;
    float dist = abs(fract((t*.1+adist))-.5);
    float white1 = max(0.,1.0 - dist * 100.0 / (kMotionBlur*speed+adist));
    float white2 = max(0.,(.5-.5*cos(k2PI * angleFract))*1./max(0.6,2.*adist*angleDist));
    float white = white1*white2;
    vec3 color;
    color.r = 5.53*white1 + white*(0.3 + 5.0*angleDist);
    color.b = white*(5.1 + 2.5*angleToRandZ);
    color.g = 6.2*white;
   
    float nebD1 = 1.0/rad + 4.5*(1.0 + sin(1.1 + 3.0*A + 0.71*cos(2.0*A)));
    float nebD2 = 1.0/rad + 3.7*(1.0 + sin(3.7 + 2.0*A + 0.46*sin(3.0*A)));
    float R1 = 1.0 * rad * (1.0 + sin(0.3+3.0*A + 2.4 * cos(0.2+3.0*A)*sin(2.1+0.42*(nebD1+speed*iTime)) + sin(2.0*6.283*position.x) ));
    float R2 = 1.0 * rad * (1.0 + sin(1.1+4.0*A + 3.2 * cos(0.7+4.0*A)*sin(1.7+0.27*(nebD2+speed*iTime)) + cos(3.0*6.283*position.y) ));
    float P1 = 0.5 + .5*sin(5.7*position.x+.22*(speed*iTime));
    float P2 = 0.5 + .5*sin(.44*position.y+4.17*(speed*iTime)) ;
    color.r += 3.6*R1 + 3.3*R2 + 2.1*P1*P2 ;
    color.b += .3*R1 + 0.8*R2 + .1*P2*R1;
    color.g += 4.1*R1*R2*P2;
    
    
    
    fragColor = vec4( (color.grb+ vec3(texture(iChannel0, (fragCoord.xy / iResolution.xy))))/1.1, 1.0);
}
// --------[ Original ShaderToy ends here ]---------- //

void main(void)
{
    mainImage(gl_FragColor, gl_FragCoord.xy);
}