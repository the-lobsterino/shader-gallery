/*
 * Original shader from: https://www.shadertoy.com/view/MsK3DR
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
const vec4 iMouse = vec4(0.);

// --------[ Original ShaderToy begins here ]---------- //
const float PI=3.14159265358979323846;
vec3 fo =vec3 (0.0961,1.28528,0.74286);
vec3 gh = vec3 (0.4273,0.62314,0.5638);
vec3 gw = vec3 (0.0,0.0,0.0);
vec4 X = vec4( 0.5,0.6,0.6,-0.22968);
vec3 BaseColor = vec3(.623529,0.623529,0.623529);
vec4 Y = vec4(1,0.6,0,0.44876);
vec4 Z = vec4(0.8,0.78,1,0.15902);
vec4 R = vec4(0.4,0.7,1,0.08464);
vec3 orbitColor;

int Iterations=12;
float Scale = 3.22996;
float MinRad2 = 0.112585;
vec4 orbitTrap = vec4(40000.0);
float r = .1;
float sr = 30.0;
mat3 rot;
float Power =6.0;
vec2 moro = vec2 (1.31,1.6);
float marched = 0.0;

float min_distance = 1.0;
float max_distance = 63.2;
mat3 rotationXY( vec2 angle ) {
	vec2 c = cos( angle );
	vec2 s = sin( angle );
	
	return mat3(
		c.y      ,  0.0, -s.y,
		s.y * s.x,  c.x,  c.y * s.x,
		s.y * c.x, -s.x,  c.y * c.x
	);
}

vec2 rotate(vec2 k,float t)
	{
	return vec2(cos(t)*k.x-sin(t)*k.y,sin(t)*k.x+cos(t)*k.y);
	}

//DarkBeam's "fold"... reinterpreted... it's more than a fold, much more! Just awesome!
float DBFold(vec3 p, float fo, float g, float w){
	if(p.z>p.y) p.yz=p.zy;
	float vx=p.x-2.*fo;
	float vy=p.y-4.*fo;
 	float v=max(abs(vx+fo)-fo,vy);
	float v1=max(vx-g,p.y-w);
	v=min(v,v1);
	v1=max(v1,-abs(p.x));
	return min(v,p.x);
}
//the coordinates are pushed/pulled in parallel
vec3 DBFoldParallel(vec3 p, vec3 fo, vec3 g, vec3 w){
	vec3 p1=p;
	p.x=DBFold(p1,fo.x,g.x,w.x);
	p.y=DBFold(p1.yzx,fo.y,g.y,w.y);
	p.z=DBFold(p1.zxy,fo.z,g.z,w.z);
	return p;
}
//serial version
vec3 DBFoldSerial(vec3 p, vec3 fo, vec3 g,vec3 w){
	p.x=DBFold(p,fo.x,g.x,w.x);
	p.y=DBFold(p.yzx,fo.y,g.y,w.y);
	p.z=DBFold(p.zxy,fo.z,g.z,w.z);
	return p;
}
float DE(vec3 p)
{
	vec4 JC=vec4(p,1.);
	float r2=dot(p,p);
	float dd = 1.;
	for(int i = 0; i<12 ; i++){
		
		p = p - clamp(p.xyz, -1.0, 1.0) * 2.0;  // mandelbox's box fold

		//Apply pull transformation
		vec3 signs=sign(p);//Save 	the original signs
		p=abs(p);
		p=DBFoldParallel(p,fo,gh,gw);
		
		p*=signs;//resore signs: this way the mandelbrot set won't extend in negative directions
		
		//Sphere fold
		r2=dot(p,p);
		float  t = clamp(1./r2, 1., 1./MinRad2);
		p*=t; dd*=t;
		
		//Scale and shift
		p=p*Scale+JC.xyz; dd=dd*Scale+JC.w;
		p=vec3(1.0,1.0,.92)*p;
	
		//For coloring and bailout
		r2=dot(p,p);
		orbitTrap = min(orbitTrap, abs(vec4(p.x,p.y,p.z,r2)));	
	}
	dd=abs(dd);
#if 1
	return (sqrt(r2)-sr)/dd;//bounding volume is a sphere
#else
	p=abs(p); return (max(p.x,max(p.y,p.z))-sr)/dd;//bounding volume is a cube
#endif
}

float opRep( vec3 p, vec3 c )
{
    vec3 q = mod(p,c)-0.5*c;
    return DE( q );
}
vec3 cpath( float t )
{
	vec3 pos = vec3( 0.0, 0.0, 95.0 + t );
	
	float a = smoothstep(5.0,20.0,t);
	pos.xz += a*150.0 * cos( vec2(1.0,6.0) + 1.0*0.01*t );
	pos.xz -= a*150.0 * cos( vec2(5.0,6.0) );
	pos.xz += a* 50.0 * cos( vec2(0.0,3.5) + 6.0*0.01*t );
	pos.xz -= a* 50.0 * cos( vec2(0.0,3.5) );

	return pos;
}
mat3 setCamera( in vec3 ro, in vec3 ta, float cr )
{
	vec3 cw = normalize(ta-ro);
	vec3 cp = vec3(sin(cr), cos(cr),0.0);
	vec3 cu = normalize( cross(cw,cp) );
	vec3 cv = normalize( cross(cu,cw) );
    return mat3( cu, cv, cw );
}
float rm(vec3 origin, vec3 ray) {
   
	float distance_marched = min_distance;

	for (int i=0; i<250; i++) {
		
		float step_distance = DE(origin + ray*distance_marched);
		if (abs(step_distance) < 0.001 ) {
			return distance_marched/(max_distance-min_distance);
		}
		distance_marched += step_distance;
		marched = distance_marched;
		if (distance_marched > max_distance) {
			return -1.0;
		}
	}
	return -1.0;
}

vec3 render(vec2 q) {
    orbitTrap.w = sqrt(orbitTrap.w);
	
    
    vec2 mouse = (iMouse.xy / iResolution.xy) * 8.0 ;
	vec3 eye = vec3(vec2(-5.0,5.5),-8.0);
	vec3 screen = vec3(q,6.222+sin(iTime)*.8);
	
	vec3 ray = normalize (screen-eye);
    mat3 rot = rotationXY(moro);
	float s = rm(rot*eye,rot*ray);
    
	orbitColor = X.xyz*X.w*orbitTrap.x +
		Y.xyz*Y.w*orbitTrap.y +
		Z.xyz*Z.w*orbitTrap.z +
		R.xyz*R.w*orbitTrap.w;
	
	vec3 color = mix(BaseColor,.79*orbitColor, 0.3743);
	//color += vec3(s-.43*.8+0.4*q.y *sin(q.x))*marched/5.26;
    return color;

}
void mainImage( out vec4 fragColor, in vec2 fragCoord )
{
	vec2 q = (6.0*fragCoord.xy-iResolution.xy)/iResolution.x;
	
	vec3 col = render(q);
		
  //vec3 col2 = texture( iChannel0,q ).xyz;
  fragColor = vec4(col,1.0); 	
	//fragColor = vec4(col.xyz+col2, 1.0);
}

// --------[ Original ShaderToy ends here ]---------- //

void main(void)
{
    mainImage(gl_FragColor, gl_FragCoord.xy);
}