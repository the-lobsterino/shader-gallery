#ifdef GL_ES
precision mediump float;
#endif

uniform float time;
uniform vec2 resolution;

#define iTime time
#define iResolution resolution

vec3 bgColor = vec3(0.01, 0.45, 1.1);

const float noiseIntensity = 2.8;
const float noiseDefinition = 0.6;
const vec2 glowPos = vec2(-0.5, 0.);

const float total = 30.;
const float minSize = 0.03;
const float maxSize = 0.08-minSize;

float random(vec2 co){
    return fract(sin(dot(co.xy ,vec2(12.9898,78.233))) * 43758.5453);
}

float noise( in vec2 p )
{
    p *= noiseIntensity;
	
    vec2 i = floor( p );
    vec2 f = fract( p );
	vec2 u = f*f*(3.0-2.0*f);
    return mix(mix(random(i + vec2(0.0,0.0)), 
                     random(i + vec2(1.0,0.0)), u.x),
                mix(random(i + vec2(0.0,1.0)), 
                     random(i + vec2(1.0,1.0)), u.x), u.y);
}

float fbm( in vec2 uv )
{

    float distortion = 5.0;
    float brigthness = 1.0;
	
    uv *= distortion;
    mat2 m = mat2( 1.6,  1.2, -1.2,  1.6 );
    float f  = 0.5000*noise( uv ); uv = m*uv;
    f += 0.2500*noise( uv ); uv = m*uv;
    f += 0.1250*noise( uv ); uv = m*uv;
    f += 0.0625*noise( uv ); uv = m*uv;
    
    f = 0.5 + 0.5 * f;

    return f * brigthness;
}

vec3 bg(vec2 uv ) {
    float velocity = -0.5;//iTime/1.6;
    float intensity = sin(uv.x*3.+velocity*2.)*1.1+1.75;
    uv.y -= 2.;
    vec2 bp = uv+glowPos;
    uv *= noiseDefinition;
    
    float rb = fbm(vec2(uv.x*.5-velocity*.03, uv.y))*.1;
    rb = sqrt(rb); 
    uv += rb;

    //coloring
    float rz = fbm(uv*.9+vec2(velocity*.35, 0.0));
    rz *= dot(bp*intensity,bp)+1.2;
    //rz *= iTime/1000.0;
	
    vec3 col = bgColor/(.1-rz);
    return sqrt(abs(col));
}

void mainImage( out vec4 fragColor, in vec2 fragCoord ) {
	
    float scale = 0.5;	
	
    vec2 res = vec2(256, 256);
    vec2 uv = fragCoord.xy / res.xy * 2. - 1.;
    uv.x *= 0.25;
    uv.y *= 0.25;
    uv.x += -0.55;
    uv.y += -0.15;
	
    uv *= scale;
    vec3 color = bg(uv)*(2.-abs(uv.y*1.75));
    fragColor = vec4(color, 1.0);
}

void main(void) {
    mainImage(gl_FragColor, gl_FragCoord.xy);
}