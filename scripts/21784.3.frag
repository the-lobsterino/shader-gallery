#ifdef GL_ES
precision mediump float;
#endif

uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;

// https://github.com/ashima/webgl-noise
vec3 mod289(vec3 x) {
  return x - floor(x * (1.0 / 289.0)) * 289.0;
}

vec2 mod289(vec2 x) {
  return x - floor(x * (1.0 / 289.0)) * 289.0;
}

vec3 permute(vec3 x) {
  return mod289(((x*34.0)+1.0)*x);
}

float snoise(vec2 v)
  {
  const vec4 C = vec4(0.211324865405187,  // (3.0-sqrt(3.0))/6.0
                      0.366025403784439,  // 0.5*(sqrt(3.0)-1.0)
                     -0.577350269189626,  // -1.0 + 2.0 * C.x
                      0.024390243902439); // 1.0 / 41.0
  vec2 i  = floor(v + dot(v, C.yy) );
  vec2 x0 = v -   i + dot(i, C.xx);

  vec2 i1;
  i1 = (x0.x > x0.y) ? vec2(1.0, 0.0) : vec2(0.0, 1.0);
  vec4 x12 = x0.xyxy + C.xxzz;
  x12.xy -= i1;

  i = mod289(i);
  vec3 p = permute( permute( i.y + vec3(0.0, i1.y, 1.0 ))
		+ i.x + vec3(0.0, i1.x, 1.0 ));

  vec3 m = max(0.5 - vec3(dot(x0,x0), dot(x12.xy,x12.xy), dot(x12.zw,x12.zw)), 0.0);
  m = m*m ;
  m = m*m ;

  vec3 x = 2.0 * fract(p * C.www) - 1.0;
  vec3 h = abs(x) - 0.5;
  vec3 ox = floor(x + 0.5);
  vec3 a0 = x - ox;

  m *= 1.79284291400159 - 0.85373472095314 * ( a0*a0 + h*h );

  vec3 g;
  g.x  = a0.x  * x0.x  + h.x  * x0.y;
  g.yz = a0.yz * x12.xz + h.yz * x12.yw;
  return 130.0 * dot(m, g);
}


float getHeight(const in vec3 p)
{
	return 
		snoise((p.xz/10.)) / 1.;
/*	return 
		(smoothstep(snoise(floor(p.xz)), snoise(vec2(0., 1.) + floor(p.xz)), length(p.z - floor(p.z)))
		+ smoothstep(snoise(floor(p.xz)), snoise(vec2(1., 0.) + floor(p.xz)), length(p.x - floor(p.x)))) / 2.;
*/}

vec3 getNormal(const in vec3 p)
{
	// http://stackoverflow.com/questions/5281261/generating-a-normal-map-from-a-height-map
	vec3 offset = vec3(-0.01, 0., 0.01);
	vec2 size = vec2(2., 0.);
	float s01 = getHeight(p + offset.xyy);
	float s21 = getHeight(p + offset.zyy);
	float s10 = getHeight(p + offset.yyx);
	float s12 = getHeight(p + offset.yyz);
	vec3 va = normalize(vec3(size.xy,s21-s01));
	vec3 vb = normalize(vec3(size.yx,s12-s10));
	return cross(va,vb);
//	vec4 bump = vec4( cross(va,vb), s11 );
}

int march100(inout vec3 camPos, in vec3 camDir)
{
	const int count = 100;
	for(int i=0; i < count; i++)
	{
		if(getHeight(camPos) >= camPos.y){
			return i;
		}
		camPos += camDir;
	}	
	return count;
}


vec3 Eye = vec3(0., 7., 0.);
vec3 Target = vec3(20., 0., 20.);
float Aspect = 1.;//480. / 640. ;
float FovY = 60. * 3.141592 / 180.0;
vec3 Light = vec3(20., 0., 20.);
float LightScale = 10.;

void main( void ) 
{
	vec2 position = ( gl_FragCoord.xy / resolution.xy );
	vec3 eye = Eye + vec3(time, 0., time);
	vec3 target = Target + vec3(time, 0., time);
	vec3 f = normalize(target - eye);
	vec3 s = normalize(cross(f, vec3(0., 1., 0.)));
	vec3 u = normalize(cross(s, f));
	// perspective
	vec3 rayPos = eye;
	vec3 rayDir = normalize(f + s*(position.x-0.5)*Aspect*FovY + u*(position.y-0.5)*Aspect);
	// ortho
//	vec3 rayPos = eye + 640.*s*(position.x-0.5) + 480.*u*(position.y-0.5);
//	vec3 rayDir = f;

	int marchCount = march100(rayPos, rayDir);
	if(marchCount == 100){
		float d=dot(rayDir, normalize(Light));
		float p = 1. - pow(d, 100.);
		if(d >= 0.992)
		{

			gl_FragColor = vec4( vec3(2., 0.7, 0.4)* p, 1.0 );
		}
		else if(d >=0.99)
		{
			gl_FragColor = vec4( d <= 0.992 ? vec3(2., 0.7, 0.4)*d : vec3(2., 0.7, 0.4)* p, 1.0 );
		
		}
		else
		{
			gl_FragColor = vec4( vec3(0., 0., 0.7), 1.0 );
		}
	}else{
		rayPos -= rayDir;
		march100(rayPos, rayDir/100.);
//		float rate = float(marchCount) / 1.;
		float rate = float(marchCount) / 1. * (rayPos.y/5.);
		gl_FragColor = vec4( vec3(getHeight(rayPos)) * rate, 1.0 );
	}
}