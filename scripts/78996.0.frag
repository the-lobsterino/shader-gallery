/*
 * Original shader from: 
 */

#ifdef GL_ES
precision mediump float;
#endif

// glslsandbox
uniform float time;
uniform vec2 resolution;

// shadertoy emulation
#define iTime time
#define iResolution resolution

// poop - NOT EXACT ;)

#define PI 3.14159267
#define TAU 6.283189

float dot2( in vec2 v ) { return dot(v,v); }
float sdCappedCone( vec3 p, float h, float r1, float r2 )
{
  vec2 q = vec2( length(p.xz), p.y );
  vec2 k1 = vec2(r2,h);
  vec2 k2 = vec2(r2-r1,2.0*h);
  vec2 ca = vec2(q.x-min(q.x,(q.y<0.0)?r1:r2), abs(q.y)-h);
  vec2 cb = q - k1 + k2*clamp( dot(k1-q,k2)/dot2(k2), 0.0, 1.0 );
  float s = (cb.x<0.0 && ca.y<0.0) ? -1.0 : 1.0;
  return s*sqrt( min(dot2(ca),dot2(cb)) );
}

float smax(float a,float b,float k)
{
    k = -k;
    float h = clamp(0.5 + 0.5 * (b - a) / k, 0.0, 1.0);
    return mix(b, a, h) - k * h * (1.0 - h);
}

mat2 rot(float a)
{
    float s=sin(a),c=cos(a);
    return mat2(c,s,-s,c);
}

float sdBox2D( in vec2 p, in vec2 b )
{
    vec2 d = abs(p)-b;
    return length(max(d,0.0)) + min(max(d.x,d.y),0.0);
}

float sdHelix(vec3 p, float radius,float height, float coils, float pd,float ph)
{
    coils =  coils / (height/PI);
    vec3 pp = vec3(normalize(p.xy)*radius, clamp(p.z, -height*0.5, height*0.5));
    float d1 = distance(p, pp);
	float d2 = asin(sin(p.z*coils + 0.5*atan(p.x,p.y)))/coils;
    float d=sdBox2D(vec2(d1,d2), vec2(pd,ph));
    return d;
}

float sdTurd(vec3 pos)
{
    float radius = 2.5;
    float height = 4.0;
    float pd = radius-0.35;
    float ph = 0.01;
    float coils = 4.0;    
    float d1 = sdHelix(pos.xzy, radius,height, coils, pd, ph)-0.02;
    float d2 = sdCappedCone(pos,(height)*0.5,radius,0.0)-0.03;
    float d = smax(d2,-d1,0.45);
    return d*0.95;
}

float map( in vec3 pos )
{
    pos.xz*=rot(fract(iTime*0.24)*6.28);
    return sdTurd(pos);
}

// http://iquilezles.org/www/articles/normalsSDF/normalsSDF.htm
vec3 calcNormal( in vec3 pos )
{
    vec2 e = vec2(1.0,-1.0)*0.5773;
    const float eps = 0.001;
    return normalize( e.xyy*map( pos + e.xyy*eps ) + 
					  e.yyx*map( pos + e.yyx*eps ) + 
					  e.yxy*map( pos + e.yxy*eps ) + 
					  e.xxx*map( pos + e.xxx*eps ) );
}


mat3 lookAtMatrix(vec3 from, vec3 to) {
    vec3 forward = normalize(to - from);
    vec3 right = normalize(cross(forward, vec3(0.0, 1.0, 0.0)));
    vec3 up = cross(right, forward);
    return mat3(right, up, forward);
}
float raycast(vec3 rayOrigin, vec3 rayDirection) {
    float maximumDistance = 30.0;
    float t = 0.0;
    for (int i = 0; i < 150; i++) {
        if (t > maximumDistance) {
            break;
        }
        vec3 currentPosition = rayOrigin + rayDirection * t;
        float d = map(currentPosition);
        if (d < 0.0001) {
            return t;
        }
        t += d;
    }
    return 0.0;
}


void mainImage(out vec4 fragColor, in vec2 fragCoord) {
	float angle = PI*0.4;
	vec3 rayOrigin = vec3(6.0 * cos(angle), 3.0+(sin(iTime*0.1)*1.5), 6.0 * sin(angle));
    vec3 targetPosition = vec3(0.0);
    mat3 cameraTransform = lookAtMatrix(rayOrigin, targetPosition);
    ivec2 sampleCount = ivec2(1.0, 1.0);

    vec2 uv = fragCoord;
    uv = uv / iResolution.xy;
    uv = (uv * 2.0) - 1.0;
    uv.x *= iResolution.x / iResolution.y;
    vec3 rayDirection = normalize(vec3(uv, 1.5));
    rayDirection = cameraTransform * rayDirection;
    float t = raycast(rayOrigin, rayDirection);
    vec3 color = vec3((1.0-abs(uv.y))*0.1);
    
    if (t > 0.0)
    {
        vec3 position = rayOrigin + rayDirection * t;
        vec3 n = calcNormal(position);
        
            vec3 mycol = vec3(0.48,0.21,0.04);
            vec3 pos = rayOrigin + t*rayDirection;
            vec3 nor = n;
            
            vec3 dir = normalize(vec3(1.0,0.7,0.0));
	        vec3 ref = reflect(rayDirection, nor);
	        float spe = max(dot(ref, dir), 0.0);
	        vec3 spec = vec3(1.0) * pow(spe, 64.);
            float dif = clamp( dot(nor,dir), 0.05, 1.0 );
            color =  mycol*dif;
            color+=spec;
    }
	fragColor = vec4(sqrt(color), 1.0);
}



// --------[ Original ShaderToy ends here ]---------- //

void main(void)
{
    mainImage(gl_FragColor, gl_FragCoord.xy);
}