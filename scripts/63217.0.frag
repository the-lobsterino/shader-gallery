/*
 * Original shader from: https://www.shadertoy.com/view/Mtt3DN
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

// Emulate a black texture
#define texture(s, uv) vec4(0.0)

// --------[ Original ShaderToy begins here ]---------- //
//By Nestor Vina

// ray marching
const int max_iterations = 100;
const float stop_threshold = 0.02;
const float grad_step = 0.1;
const float clip_far = 1000.0;

// math
const float PI = 3.14159265359;
const float DEG_TO_RAD = PI / 180.0;

const vec3 sunDir = normalize(vec3(1.0,-1.0,1.0));

float smin( float a, float b, float k )
{
    float res = exp( -k*a ) + exp( -k*b );
    return -log( res )/k;
}

float sdEllipsoid( in vec3 p, in vec3 r )
{
    return (length( p/r ) - 1.0) * min(min(r.x,r.y),r.z);
}

float sdSphere( vec3 p, float s )
{
  return length(p)-s;
}

float sdCone( vec3 p, vec2 c )
{
    // c must be normalized
    float q = length(p.xy);
    return dot(c,vec2(q,p.z));
}

float sdCappedCone( in vec3 p, in vec3 c )
{
    vec2 q = vec2( length(p.xz), p.y );
    vec2 v = vec2( c.z*c.y/c.x, -c.z );
    vec2 w = v - q;
    vec2 vv = vec2( dot(v,v), v.x*v.x );
    vec2 qv = vec2( dot(v,w), v.x*w.x );
    vec2 d = max(qv,0.0)*qv/vv;
    return sqrt( dot(w,w) - max(d.x,d.y) )* sign(max(q.y*v.x-q.x*v.y,w.y));
}


vec3 rotate( vec3 p, vec3 rot ){
    rot.z = -rot.z;
    /*rot.y = -rot.y;
    rot.x = -rot.x;*/
    mat3 ry = mat3(cos(rot.y), 0.0,-sin(rot.y),
			   0.0, 1.0, 0.0, 
			   sin(rot.y), 0.0, cos(rot.y)  );
    
	mat3 rz = mat3(cos(rot.z),-sin(rot.z), 0.0,
			   sin(rot.z), cos(rot.z), 0.0,
			   0.0, 0.0, 1.0 );
     
	mat3 rx = mat3(1.0, 0.0, 0.0,
			   0.0, cos(rot.x), sin(rot.x), 
			   0.0,-sin(rot.x), cos(rot.x) );
    return p*rz*ry*rx;
}

float opS( float d1, float d2 )
{
    return max(-d2,d1);
}

vec2 opU( vec2 d1, vec2 d2 )
{
	return (d1.x<d2.x) ? d1 : d2;
}

vec2 opUS( vec2 d1, vec2 d2, float smoothv )
{
	return vec2(smin(d1.x,d2.x, smoothv), (d1.y<d2.y)?d1.y:d2.y);
}

float grassFloor( vec3 p )
{    //0.25 0.3
	return -p.y-(texture(iChannel0,p.xz*0.25).xyz+texture(iChannel0,p.xz*0.25).xyz).x*clamp(length(p.xz)/10.0,0.3,0.3) + (sin(length(p.xz*0.2)+iTime)+cos((p.x+p.z)*0.1)) * clamp(length(p.xz)/100.0,0.0,1.0);
}

float animate(float state1, float state2, float speed){
	return mix(state1,state2,(sin(iTime * speed)+1.0)*0.5);
}

vec3 animate(vec3 state1, vec3 state2, float speed){
	return mix(state1,state2,(sin(iTime * speed)+1.0)*0.5);
}

vec2 map( vec3 p) {
    //This is generated with the editor
    float smoothv = 8.0;
    vec2 theDistMap;
    theDistMap = vec2(sdEllipsoid(rotate(p+vec3(0.184,4.657,2.539008),vec3(0,0,1.04074)),vec3(0.7983306,0.3005614,0.3005613)),0.);//SpherePrimitive (21)
    theDistMap = opUS( theDistMap,vec2(sdEllipsoid(rotate(p+vec3(-2.004,4.657,2.539008),vec3(0,0,5.24191)),vec3(0.7983306,0.3005614,0.3005613)),0.),smoothv);//SpherePrimitive (20)
    theDistMap = opUS( theDistMap,vec2(sdEllipsoid(rotate(p+vec3(-0.33,3.71,2.539008),vec3(0,0,1.04074)),vec3(1.797465,0.6767231,0.676723)),0.),smoothv);//SpherePrimitive (19)
    theDistMap = opUS( theDistMap,vec2(sdEllipsoid(rotate(p+vec3(-1.46,3.69,2.539008),vec3(0,0,5.24191)),vec3(1.797465,0.6767231,0.676723)),0.),smoothv);//SpherePrimitive (18)
    theDistMap = opUS( theDistMap,vec2(sdEllipsoid(p+vec3(-0.9,0.07,2.539008),vec3(2.891563,2.358033,2.458335)),0.),smoothv);//SpherePrimitive (17)
    theDistMap = opUS( theDistMap,vec2(sdEllipsoid(p+vec3(-2.37,-1.28,2.539008),vec3(1.54646,2.071041,1.581679)),0.),smoothv);//SpherePrimitive (6)
    theDistMap = opUS( theDistMap,vec2(sdEllipsoid(p+vec3(0.62,-1.28,2.539008),vec3(1.54646,2.071041,1.581679)),0.),smoothv);//SpherePrimitive (5)
    theDistMap = opUS( theDistMap,vec2(sdEllipsoid(p+vec3(-2.76,-3.44,2.539008),vec3(0.9098507,0.6588253,0.909851)),1.),smoothv);//SpherePrimitive (16)
    theDistMap = opUS( theDistMap,vec2(sdEllipsoid(rotate(p+vec3(1.61,1.53,2.539008),vec3(0,0,0.05597721)),vec3(2.088583,0.8877339,0.856907)),0.),smoothv);//SpherePrimitive (15)
    theDistMap = opUS( theDistMap,vec2(sdEllipsoid(p+vec3(-0.9,-0.92,2.539008),vec3(3.05492,2.401215,2.595999)),0.),smoothv);//SpherePrimitive (3)
    theDistMap = opUS( theDistMap,vec2(sdEllipsoid(p+vec3(0.86,-3.44,2.539008),vec3(0.9098507,0.6588253,0.909851)),1.),smoothv);//SpherePrimitive (11)
    theDistMap = opUS( theDistMap,vec2(sdEllipsoid(p+vec3(-0.9,0.69,2.539008),vec3(2.67366,2.180336,2.273079)),0.),smoothv);//SpherePrimitive (14)
    theDistMap = opUS( theDistMap,vec2(sdEllipsoid(p+vec3(-0.9,3.46,2.539008),vec3(1.780099,1.520442,1.27847)),0.),smoothv);//SpherePrimitive (13)
    theDistMap = opUS( theDistMap,vec2(sdEllipsoid(rotate(p+vec3(-3.38,1.53,2.539008),vec3(0,0,6.21458)),vec3(2.088583,0.8877339,0.856907)),0.),smoothv);//SpherePrimitive (12)
    theDistMap = opU( theDistMap,vec2(sdEllipsoid(rotate(p+vec3(-2.397,-3.624,2.172),vec3(6.276079,1.48114,0.01412571)),vec3(0.6999256,0.149456,0.149456)),2.));//SpherePrimitive (35)
    theDistMap = opU( theDistMap,vec2(sdEllipsoid(rotate(p+vec3(-2.807,-3.622,2.098),vec3(0.0298735,1.741581,0.04428608)),vec3(0.8622792,0.1841235,0.1841235)),2.));//SpherePrimitive (34)
    theDistMap = opU( theDistMap,vec2(sdEllipsoid(rotate(p+vec3(-3.326,-3.589,2.048),vec3(0.3574849,5.10397,6.271338)),vec3(0.6553322,0.1399339,0.1399339)),2.));//SpherePrimitive (33)
    theDistMap = opU( theDistMap,vec2(sdEllipsoid(rotate(p+vec3(0.388,-3.721,2.184),vec3(0,1.570796,0)),vec3(0.6553322,0.1399339,0.1399339)),2.));//SpherePrimitive (32)
    theDistMap = opU( theDistMap,vec2(sdEllipsoid(rotate(p+vec3(0.858,-3.782,2.232),vec3(0.05113041,1.161677,0.01545978)),vec3(0.8622792,0.1841235,0.1841235)),2.));//SpherePrimitive (31)
    theDistMap = opU( theDistMap,vec2(sdEllipsoid(rotate(p+vec3(1.269,-3.75,2.45),vec3(0.003413021,0.7975222,0.01543972)),vec3(0.8622792,0.1841235,0.1841235)),2.));//SpherePrimitive (30)
    theDistMap = opU( theDistMap,vec2(sdEllipsoid(rotate(p+vec3(-5.115,1.524,2.177),vec3(0,0,0.008595686)),vec3(0.4133087,0.08935363,0.08935362)),2.));//SpherePrimitive (29)
    theDistMap = opU( theDistMap,vec2(sdEllipsoid(rotate(p+vec3(-5.286,1.723,2.386),vec3(0,0,0.008595686)),vec3(0.4133087,0.08935363,0.08935362)),2.));//SpherePrimitive (28)
    theDistMap = opU( theDistMap,vec2(sdEllipsoid(rotate(p+vec3(-5.286,1.723,2.625),vec3(0,0,0.008595686)),vec3(0.4133087,0.08935363,0.08935362)),2.));//SpherePrimitive (27)
    theDistMap = opU( theDistMap,vec2(sdEllipsoid(rotate(p+vec3(-5.286,1.668,2.831),vec3(0,0,0.008595686)),vec3(0.4133087,0.08935363,0.08935362)),2.));//SpherePrimitive (26)
    theDistMap = opU( theDistMap,vec2(sdEllipsoid(rotate(p+vec3(3.54,1.55,2.831),vec3(0,0,0.008595686)),vec3(0.4133087,0.08935363,0.08935362)),2.));//SpherePrimitive (25)
    theDistMap = opU( theDistMap,vec2(sdEllipsoid(rotate(p+vec3(3.54,1.605,2.625),vec3(0,0,0.008595686)),vec3(0.4133087,0.08935363,0.08935362)),2.));//SpherePrimitive (24)
    theDistMap = opU( theDistMap,vec2(sdEllipsoid(rotate(p+vec3(3.54,1.605,2.386),vec3(0,0,0.008595686)),vec3(0.4133087,0.08935363,0.08935362)),2.));//SpherePrimitive (23)
    theDistMap = opU( theDistMap,vec2(sdEllipsoid(rotate(p+vec3(3.426,1.406,2.177),vec3(0,0,0.008595686)),vec3(0.4133087,0.08935363,0.08935362)),2.));//SpherePrimitive (22)

    //End of generated part
    theDistMap = opU( theDistMap,vec2(grassFloor(p + vec3(0.0,-4.0,0.0)),4.0));    
    return theDistMap;
}

// ray marching
vec2 ray_marching( vec3 origin, vec3 dir, float start, float end ) {
	
    float depth = start;
	for ( int i = 0; i < max_iterations; i++ ) {
        vec2 distResult = map( origin + dir * depth );
		float dist = distResult.x;
		if ( dist < stop_threshold ) {
			return vec2(depth,distResult.y);
		}
		depth += dist;
		if ( depth >= end) {
			return vec2(end,-1.0);
		}
	}
	return vec2(end,-1.0);
}

// get ray direction
vec3 ray_dir( float fov, vec2 size, vec2 pos ) {
	vec2 xy = pos - size * 0.5;
	float cot_half_fov = tan( ( 90.0 - fov * 0.5 ) * DEG_TO_RAD );	
	float z = size.y * 0.5 * cot_half_fov;	
	return normalize( vec3( -xy, -z ) );
}

vec3 normal( vec3 pos ) {
	const vec3 dx = vec3( grad_step, 0.0, 0.0 );
	const vec3 dy = vec3( 0.0, grad_step, 0.0 );
	const vec3 dz = vec3( 0.0, 0.0, grad_step );
	return normalize (
		vec3(
			map( pos + dx ).x - map( pos - dx ).x,
			map( pos + dy ).x - map( pos - dy ).x,
			map( pos + dz ).x - map( pos - dz ).x			
		)
	);
}

// camera rotation : pitch, yaw
mat3 rotationXY( vec2 angle ) {
	vec2 c = cos( angle );
	vec2 s = sin( angle );
	
	return mat3(
		c.y      ,  0.0, -s.y,
		s.y * s.x,  c.x,  c.y * s.x, 
		s.y * c.x, -s.x,  c.y * c.x
	);
}

float fresnel(vec3 n, vec3 d, float exp ){
    return pow(1.0-dot(d,n),exp);
}

vec3 snorlaxNail( vec3 v, vec3 n, vec3 eye ) {
    vec3 albedo = vec3(1.0,0.9,0.9);
    vec3 ambient = vec3(0.05,0.05,0.05);
    vec3 viewDir = normalize(eye-v);    
    vec3 fresnelColor = vec3(0.4,0.3,0.7) * fresnel(n,viewDir,2.0);    
    vec3 diffuse = vec3(0.4,0.4,0.4)*dot(sunDir,n);
    return albedo+diffuse;
}

vec3 snorlaxBodySpot( vec3 v, vec3 n, vec3 eye ) {
    vec3 albedo = vec3(0.937,0.847,0.690);
    vec3 ambient = vec3(0.05,0.05,0.05);
    vec3 viewDir = normalize(eye-v);    
    vec3 fresnelColor = vec3(1.0,0.0,0.0) * fresnel(n,viewDir,2.0);    
    vec3 diffuse = vec3(0.2)*dot(sunDir,n);
    return mix(albedo,fresnelColor,0.15)+diffuse;
}

vec3 snorlaxBlack( vec3 v, vec3 n, vec3 eye ) {
    vec3 albedo = vec3(0.1,0.1,0.1);
    vec3 ambient = vec3(0.05,0.05,0.05);    
    vec3 viewDir = normalize(eye-v);    
    vec3 fresnelColor = vec3(0.4,0.3,0.7) * fresnel(n,viewDir,2.0);
    vec3 diffuse = vec3(0.2)*dot(sunDir,n);
    return albedo+diffuse;
}

vec3 snorlaxBody( vec3 v, vec3 n, vec3 eye ) {
    
    float distToSpot = sdEllipsoid(v+vec3(-0.9,0.17,0.52),vec3(2.633887,2.86443,2.633886));
    distToSpot = min( distToSpot,sdEllipsoid(v+vec3(-0.9,3.2,0.84),vec3(1.464067,1.592216,1.464067)));
    distToSpot = max( distToSpot, -sdEllipsoid(rotate(v+vec3(-0.9,10.24,3.03),vec3(0.2538913,0,0)),vec3(0.7843115,6.743474,0.7843112)));
    
    float eyes = sdEllipsoid(rotate(v+vec3(-1.502,3.537,1.162),vec3(5.546469,0,0)),vec3(0.5,0.1721386,0.5));
    eyes = min( eyes, sdEllipsoid(rotate(v+vec3(-0.398,3.537,1.162),vec3(5.546469,0,0)),vec3(0.5,0.1721386,0.5)));
    eyes = sdEllipsoid(rotate(v+vec3(-1.502,3.537,1.162),vec3(5.546469,0,0)),vec3(0.5,0.1721386,0.5));
    
    float rightEye = sin(v.x*1.0+3.2)-v.y - 2.9;
    rightEye += clamp((v.x-1.8)*10000.0,0.0,100.0);
    rightEye += clamp((-v.x+1.1)*10000.0,0.0,100.0);
    
    float leftEye = sin(v.x*1.0-1.8)-v.y - 2.9;
    leftEye += clamp((v.x-0.7)*10000.0,0.0,100.0);
    leftEye += clamp((-v.x+0.0)*10000.0,0.0,100.0);
    
    eyes = min(rightEye, leftEye);
    
    float mouth = sin(v.x*0.5+1.1)*2.0-v.y - 5.2;
    mouth += clamp((v.x-1.6)*10000.0,0.0,100.0);
	mouth += clamp((-v.x+0.2)*10000.0,0.0,100.0);
    
    if( distToSpot <= 0.02 ){
        if(eyes <= 0.00001 && eyes >= -0.06)
            return snorlaxBlack(v,n,eye);
        else if( mouth <= 0.0001 && mouth > -0.06 ){
        	 return snorlaxBlack(v,n,eye);
        }
        else
        	return snorlaxBodySpot(v,n,eye);        
    }
    
    vec3 albedo = vec3(0.105,0.341,0.48627);
    vec3 ambient = vec3(0.05,0.05,0.05);
    
    vec3 viewDir = normalize(eye-v);    
    vec3 fresnelColor = vec3(0.0,0.0,0.2) * fresnel(n,viewDir,2.0);    
    
    vec3 diffuse = vec3(0.2)*dot(sunDir,n);
   
    return albedo+diffuse+fresnelColor;
}

float shadowCast( vec3 origin, vec3 dir, float start, float end ){
    float depth = start;
	for ( int i = 0; i < max_iterations; i++ ) {
        vec2 distResult = map( origin + dir * depth );
		float dist = distResult.x;
		if ( dist <= stop_threshold ) 
			return 0.0;
		depth += dist;
		if ( depth >= end) return 1.0;
	}
	return 1.0;
}

vec3 floorShading( vec3 v, vec3 n, vec3 eye ){  
    vec3 tintColor = vec3(0.2,0.5,0.0);
    float height = (texture(iChannel0,v.xz*0.25).x+texture(iChannel0,v.xz*0.25).x);
    height = clamp (height, 0.0,3.0);
    vec3 albedo = height * tintColor*1.5;
    
    vec3 normal = texture(iChannel1,v.xz*0.05).xyz;
    
    vec3 lightColor = vec3(0.2,0.2,0.2);
    float shadow = clamp(shadowCast(v,sunDir,0.5,100.0),0.0,1.0);
    vec3 diffuse = clamp(albedo*dot(sunDir,n),0.0,1.0)*0.5;
    
    return diffuse + shadow*lightColor;
}

void mainImage( out vec4 fragColor, in vec2 fragCoord )
{
	// default ray dir
	vec3 dir = ray_dir( 45.0, iResolution.xy, fragCoord.xy );
	
	// default ray origin
	vec3 eye = vec3( 0.0, -2.0, 16.0 );

	// rotate camera
	mat3 rot = rotationXY( vec2(0.4,iMouse.x/iResolution.x*10.0));//vec2(-0.2, iTime/2.0 ) );
	dir = rot * dir;
	eye = rot * eye;
	
    vec3 fogColor = vec3(0.3,0.6,0.9);
	// ray marching
    vec2 rayResult = ray_marching( eye, dir, 0.0, clip_far );
	float depth = rayResult.x;
	if ( depth >= clip_far ) {        
		fragColor = vec4(fogColor,1.0);//Background color
        return;
	}
	
	// shading
	vec3 pos = eye + dir * depth;
	vec3 n = normal( pos );    
    
    if( rayResult.y == 0.0 )
    	fragColor = vec4(snorlaxBody( pos, n, eye ), 1);
    else if( rayResult.y == 1.0)
    	fragColor = vec4(snorlaxBodySpot( pos, n, eye ),1.0);
    else if( rayResult.y == 2.0 )
        fragColor = vec4(snorlaxNail( pos, n, eye ),1.0);
    else if( rayResult.y == 4.0 )
        fragColor = vec4(floorShading( pos, n, eye ),1.0);
    fragColor = vec4(mix( fragColor.xyz,fogColor, clamp((depth-20.0)*0.006,0.0,1.0)),1.0);
}
// --------[ Original ShaderToy ends here ]---------- //

void main(void)
{
    iMouse = vec4(mouse * resolution, 0., 0.);
    mainImage(gl_FragColor, gl_FragCoord.xy);
}