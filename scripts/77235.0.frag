/*
 * Original shader from: https://www.shadertoy.com/view/NlVGzR
 */

#ifdef GL_ES
precision mediump float;
#endif

// glslsandbox uniforms
uniform float time;
uniform vec2 resolution;
uniform vec2 mouse;

// shadertoy emulation
#define iTime time
#define iResolution resolution
vec4 iMouse = vec4(0.);

// --------[ Original ShaderToy begins here ]---------- //
#define MAX_FLOAT 1e5
#define MIN_FLOAT 1e-5
const float PI = acos(-1.);

struct Ray{ vec3 origin, dir;};
struct Hit{ float dst; int id; vec3 nrm;};

vec3 rayDirection(float fieldOfView, vec2 size, vec2 fragCoord) {
    vec2 xy = fragCoord - size / 2.;
    float z = size.y / tan(radians(fieldOfView) / 2.);
    return normalize(vec3(xy, -z));
}

mat4 viewMatrix(vec3 eye, vec3 center, vec3 up) {
    vec3 f = normalize(center - eye),
         s = normalize(cross(f, up)),
         u = cross(s, f);
    return mat4(vec4(s, 0.), vec4(u, 0.), vec4(-f, 0.), vec4(vec3(0.), 1.));
}

mat3 calcLookAtMatrix(in vec3 camPosition, in vec3 camTarget, in float roll) {
  vec3 ww = normalize(camTarget - camPosition);
  vec3 uu = normalize(cross(ww, vec3(sin(roll), cos(roll), 0.0)));
  vec3 vv = normalize(cross(uu, ww));

  return mat3(uu, vv, ww);
}

float hexDistance(in vec2 p){
	p = abs(p);
    float h = dot(p, normalize(vec2(1., 1.73)));
    return max(h, p.x);
}

vec4 hexCoord(in vec2 uv){
    vec2 r = vec2(1.73, 1.);
    vec2 h = r * .5;
    
    vec2 a = mod(uv, r) - h;
    vec2 b = mod(uv-h, r) - h;
    
    vec2 gv;
    if(length(a) < length(b))
        gv = a;
    else
        gv = b;
    
    float x = atan(-gv.y, gv.x) + PI;
    float y = .5 - hexDistance(gv);
    return vec4(x, y, uv - gv);
}

#define ZERO (0)

float wave(vec2 xy) {
    return smoothstep(1., 3., distance(length(xy), fract(iTime * .75) * 10.));
}

float map(vec3 p){
    vec4 hexx = hexCoord(p.xz * 5.);
    float h = hexx.y - .01;
    h = max(-h, p.y - wave(hexx.zw) * .2 + pow(smoothstep(.075, 0., hexx.y), 2.) * .01);
    h = min(p.y + .2, h);
    return h;
}

const float epsilon = 0.0001;
vec3 calculateNormals(vec3 pos){
    vec2 eps = vec2(0.0, epsilon);
    vec3 n = normalize(vec3(
    map(pos + eps.yxx) - map(pos - eps.yxx),
    map(pos + eps.xyx) - map(pos - eps.xyx),
    map(pos + eps.xxy) - map(pos - eps.xxy)));
    return n;
}

const int stepsCnt = 128;
float marchRay(in Ray r){
    float t = (.2 - r.origin.y)/r.dir.y;
    for(int i = 0; i <= stepsCnt; i++){
        vec3 p = r.origin + r.dir * t;
        float dst = map(p);
        
        if(dst < .001)
            return t;
        
        t += dst * .5;
    }
    return -1.;
}

float calcAO( in vec3 pos, in vec3 nor )
{
	float occ = 0.0;
    float sca = 1.0;
    for( int i=ZERO; i<5; i++ )
    {
        float h = 0.01 + 0.12 * float(i)/4.0;
        float d = map( pos + h*nor );
        occ += (h-d)*sca;
        sca *= 0.95;
        if( occ>0.35 ) break;
    }
    return clamp( 1.0 - 3.0*occ, 0.0, 1.0 ) * (0.5+0.5*nor.y);
}

// http://iquilezles.org/www/articles/rmshadows/rmshadows.htm
float calcSoftshadow( in vec3 ro, in vec3 rd, in float mint, in float tmax )
{
    // bounding volume
    float tp = (-ro.y)/rd.y; if( tp>0.0 ) tmax = min( tmax, tp );

    float res = 1.0;
    float t = mint;
    for( int i=ZERO; i<32; i++ )
    {
		float h = map( ro + rd*t );
        float s = clamp(8.0*h/t,0.0,1.0);
        res = min( res, s*s*(3.0-2.0*s) );
        t += clamp( h, 0.01, 0.011 );
        if( res<0.004 || t>tmax ) break;
    }
    return clamp( res, 0.0, 1.0 );
}

vec3 makeClr(vec2 fragCoord){
    vec3 viewDir = rayDirection(60., iResolution.xy, fragCoord);
    float ang = (iResolution.y - iMouse.y) * .01 / 3.1415;
    vec3 origin = vec3(0., max(3. * cos(ang), 2.5), -3. * sin(ang));
    //vec3 origin = vec3(0., 3., 0.);
    mat4 viewToWorld = viewMatrix(origin, vec3(0.), vec3(0., 0., 1.));
    vec3 dir = (viewToWorld * vec4(viewDir, 1.0)).xyz;
    
    Ray camRay = Ray(origin, dir);
    float hit = marchRay(camRay);

    vec3 col;
    {
        vec3 pos = origin + dir * hit;
        vec3 nor = calculateNormals(pos);
        vec3 ref = reflect( dir, nor );
        col = vec3(1.);
        
        
        // lighting
        float occ = calcAO( pos, nor );
        
		vec3 lin = vec3(0.0);
        float ks = 1.0;
        
        // sun
        {
            vec3  lig = normalize( vec3(-0.5, 0.1, 0.5) );
            vec3  hal = normalize( lig - dir );
            float dif = clamp( dot( nor, lig ), 0.0, 1.0 );
        	      dif *= calcSoftshadow( pos, lig, 0.02, 2.5 );
			float spe = pow( clamp( dot( nor, hal ), 0.0, 1.0 ),16.0);
                  spe *= dif;
                  spe *= 0.04+0.96*pow(clamp(1.0-dot(hal,lig),0.0,1.0),5.0);
            lin += col*2.20*dif*vec3(1.0,1.00,1.0);
            lin +=     5.00*spe*vec3(1.0,1.00,1.0) * ks;
        }
        // sky
        {
            float dif = sqrt(clamp( 0.5+0.5*nor.y, 0.0, 1.0 ));
                  dif *= occ;
            float spe = smoothstep( -0.2, 0.2, ref.y );
                  spe *= dif;
                  spe *= 0.04+0.96*pow(clamp(1.0+dot(nor, dir),0.0,1.0), 5.0 );
                  spe *= calcSoftshadow( pos, ref, 0.02, 2.5 );
            lin += col*0.60*dif*vec3(0.60,0.60,1.);
            lin +=     2.00*spe*vec3(0.60,0.60,1.)*ks;
        }
        // back
        {
        	float dif = clamp( dot( nor, normalize(vec3(0.5,0.0,0.6))), 0.0, 1.0 )*clamp( 1.0-pos.y,0.0,1.0);
                  dif *= occ;
        	lin += col*0.55*dif*vec3(0.25,0.25,0.25);
        }
        // sss
        {
            float dif = pow(clamp(1.0+dot(nor, dir),0.0,1.0),2.0);
                  dif *= occ;
        	lin += col*0.25*dif*vec3(1.00,1.00,1.00);
        }
        
		col = lin;
        col = mix( col, vec3(0.7,0.7,0.9), 1.0-exp( -0.0001*hit*hit*hit ) );
        
    }
    return col;
}

#define AA 1
void mainImage( out vec4 fragColor, in vec2 fragCoord ){
    fragColor = vec4(0.);
    for(int y = 0; y < AA; ++y)
        for(int x = 0; x < AA; ++x){
            fragColor.rgb += clamp(makeClr(fragCoord + vec2(x, y) / float(AA)), 0., 1.);
        }
    
    fragColor.rgb /= float(AA * AA);
}
// --------[ Original ShaderToy ends here ]---------- //

void main(void)
{
    iMouse = vec4(mouse * resolution, 0., 0.);
    mainImage(gl_FragColor, gl_FragCoord.xy);
    gl_FragColor.a = 1.;
}