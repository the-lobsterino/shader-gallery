/*
 * Original shader from: https://www.shadertoy.com/view/fsKyRt
 */

#ifdef GL_ES
precision highp float;
#endif

// glslsandbox uniforms
uniform float time;
uniform vec2 resolution;

// shadertoy emulation
#define iTime time
#define iResolution resolution
const vec4 iMouse = vec4(0.);

// --------[ Original ShaderToy begins here ]---------- //
// philip.bertani@gmail.com

// the dust cloud is swirling around the YZ plane
// clicking near the center of the screen keeps your motion aligned
// with the rotation of the dust cloud so you should see vertical motion blur
// click on the sides and it is more interesting

// performance is aweful on 1080p unless you have a high end GPU
// any suggestions appreciated...

#define oct 7   //number of fbm octaves
#define pi  3.14159265

float random(vec2 p) {
    //a random modification of the one and only random() func
    return fract( sin( dot( p, vec2(12., 90.)))* 1e5 );
}


//this is taken from Visions of Chaos shader "Sample Noise 2D 4.glsl"
float noise(vec3 p) {
    vec2 i = floor(p.yz);
    vec2 f = fract(p.yz);
    float a = random(i + vec2(0.,0.));
    float b = random(i + vec2(1.,0.));
    float c = random(i + vec2(0.,1.));
    float d = random(i + vec2(1.,1.));
    vec2 u = f*f*(3.-2.*f); //smoothstep here, it also looks good with u=f
    
    return mix(a,b,u.x) + (c-a)*u.y*(1.-u.x) + (d-b)*u.x*u.y;

}

float fbm3d(vec3 p) {
    float v = 0.;
    float a = .5;
    vec3 shift = vec3(100.);  //play with this
    
    float angle = pi/2.;      //play with this
    float cc=cos(angle), ss=sin(angle);  //yes- I know cos(pi/2.)=0.
    mat3 rot = mat3( cc,  0., ss, 
                      0., 1., 0.,
                     -ss, 0., cc );
    for (int i=0; i<oct; i++) {
        v += a * noise(p);
        p = rot * p * 2. + shift;
        a *= .6;  //changed from the usual .5
    }
    return v;
}

mat3 rxz(float an){
    float cc=cos(an),ss=sin(an);
    return mat3(cc,0.,-ss,
                0.,1.,0.,
                ss,0.,cc);                
}
mat3 ryz(float an){
    float cc=cos(an),ss=sin(an);
    return mat3(1.,0.,0.,
                0.,cc,-ss,
                0.,ss,cc);
}   

vec3 get_color(vec3 p) {
    vec3 q;
    q.x = fbm3d(p);
    q.y = fbm3d(p.yzx);
    q.z = fbm3d(p.zxy);

    float f = fbm3d(p + q);
    
    return q*f;
}

void mainImage( out vec4 fragColor, in vec2 fragCoord )
{

    float tt = iTime / 8.;
    vec2 uv = (2.*fragCoord-iResolution.xy)/iResolution.y;
    vec2 mm = (2.*iMouse.xy-iResolution.xy)/iResolution.y;

    vec3 rd = normalize( vec3(uv, -2.) );  
    vec3 ro = vec3(0.,0.,0.);
    
    float delta = 2.*pi/10.;
    float initm = -.5 * delta;
    mat3 rot = rxz(-mm.x*delta) * ryz(-mm.y*delta);
    
    ro -= rot[2]*iTime*2.;
    
    rd = rot * rd;
    
    vec3 p = ro + rd;
    
    vec3 cc = vec3(0.);

    float stepsize = .034;
    float totdist = stepsize;
    
    for (int i=0; i<50; i++) {
       vec3 cx = get_color(p);
       p += stepsize*rd;
       float fi = float(i);
       cc += exp(-totdist*totdist*2.)* cx;
       totdist += stepsize;
       rd = ryz(.2)*rd;   //yz rotation here
    }
    
    
    vec3 x2 = ro, x1=vec3(.5,-1.,5.);
    vec3 x0 = p + abs(cc);
    
    float dist_to_line = length( cross( (x0-x1), (x0-x2) ) ) / length( x2 - x1 );
    
    cc = .5 + 1.5*(cc-.5);  //more contrast makes nice shimmering blobs
    cc = pow( cc/15. , vec3(1.9));    //play with this

    fragColor = vec4(cc,1.0);
    
    
}
// --------[ Original ShaderToy ends here ]---------- //

void main(void)
{
    mainImage(gl_FragColor, gl_FragCoord.xy);
}