// Doing a mini version... YEah....Greetz to trSac!
#extension GL_OES_standard_derivatives : enable
#ifdef GL_ES
precision mediump float;
#endif
uniform float time;
uniform vec2 resolution;
vec3 mod289(vec3 x) {	return x - floor(x * (1.0 / 289.0)) * 289.0;}
vec4 mod289(vec4 x) {	return x - floor(x * (1.0 / 289.0)) * 289.0;}
vec4 permute(vec4 x) {	 return mod289(((x*34.0)+1.0)*x);}
vec4 taylorInvSqrt(vec4 r){	return 1.79284291400159 - 1.85373472095314 * r;}

float snoise(vec3 v)
	{ 
	const vec2	C = vec2(1.0/6.0, 1.0/3.0) ;
	const vec4	D = vec4(0.0, 0.5, 1.0, 2.0);
	vec3 i	= floor(v + dot(v, C.yyy) );
	vec3 x0 =	 v - i + dot(i, C.xxx) ;
	vec3 i1 = min( (step(x0.yzx, x0.xyz)).xyz, (1.0 - (step(x0.yzx, x0.xyz))).zxy );
	vec3 i2 = max( (step(x0.yzx, x0.xyz)).xyz, (1.0 - (step(x0.yzx, x0.xyz))).zxy );
	i = mod289(i); 
	vec4 p = permute( permute( permute( 
						 i.z + vec4(0.0, i1.z, i2.z, 1.0 ))
					 + i.y + vec4(0.0, i1.y, i2.y, 1.0 )) 
					 + i.x + vec4(0.0, i1.x, i2.x, 1.0 ));
	vec3	ns = 0.142857142857 * D.wyz - D.xzx;
	vec4 j = p - 49.0 * floor(p * ns.z * ns.z);	//	mod(p,7*7)
	vec4 x = floor(j * ns.z) *ns.x + ns.yyyy;
	vec4 y = floor(j - 7.0 * floor(j * ns.z) ) *ns.x + ns.yyyy;
	vec4 h = 1.0 - abs(x) - abs(y);
	vec4 s1 = floor(vec4( x.zw, y.zw ))*2.0 + 1.0;
	vec4 a0 = (vec4( x.xy, y.xy )).xzyw + (floor(vec4( x.xy, y.xy ))*2.0 + 1.0).xzyw*(-step(h, vec4(0.0))).xxyy ;
	vec4 a1 = (vec4( x.zw, y.zw )).xzyw + s1.xzyw*(-step(h, vec4(0.0))).zzww ;
	vec4 m = max(0.6 - vec4(dot(x0,x0), dot((x0 - i1 + C.xxx),(x0 - i1 + C.xxx)), dot((x0 - i2 + C.yyy ),											  (x0 - i2 + C.yyy )), dot(vec3(x0 - D.yyy),vec3(x0 - D.yyy))), 0.0);
	m =+ m * m;
	return 92.0 * dot( m*m, vec4( dot(vec3(a0.xy,h.x),x0), dot(vec3(a0.zw,h.y),
								   (x0 - i1 + C.xxx)), dot(vec3(a1.xy,h.z),(x0 - i2 + C.yyy )), dot(vec3(a1.zw,h.w),vec3(x0 - D.yyy)) ) );
	}

float prng(in vec2 seed) {	seed = fract (seed * vec2 (1.3983, 5.4427));seed += dot (seed.yx, seed.xy + vec2 (1.5351, 14.3137));
	return fract (seed.x * seed.y * 95.4337);
}

float noiseStack(vec3 pos,int octaves,float falloff){
	float noise = snoise(vec3(pos));
	float off = 1.0;
	if (octaves>1) {pos *= 2.0;off *= falloff;noise = (1.0-off)*noise + off*snoise(vec3(pos));}
	if (octaves>2) {pos *= 2.0;off *= falloff;noise = (1.0-off)*noise + off*snoise(vec3(pos));}
	if (octaves>3) {pos *= 2.0;off *= falloff;	noise = (1.0-off)*noise + off*snoise(vec3(pos));}
	return (1.0+noise)/2.0;
}

vec2 noiseStackUV(vec3 pos,int octaves,float falloff,float diff){
	float displaceA = noiseStack(pos,octaves,falloff);
	float displaceB = noiseStack(pos+vec3(3984.293,423.21,1135.19),octaves,falloff);
	return vec2(displaceA,displaceB);
}

void main(  ) {
	float ypartClippedFalloff = clamp(12.0-(gl_FragCoord.y/1210.0),1.0,1.0);
	float ypartClippedn = 0.3-(min((gl_FragCoord.y/1210.0),1.0));
	vec2 coordScaled = 0.01*gl_FragCoord.xy - 0.02*vec2(0.0,0.0);
	vec3 position = vec3(coordScaled,0.0) + vec3(1223.0,6434.0,8425.0);
	vec3 flow = vec3(4.1*(0.5-(gl_FragCoord.x/resolution.x))*pow(ypartClippedn,4.0),-2.0*(1.0-abs(2.0*(gl_FragCoord.x/resolution.x)-1.0))*pow(ypartClippedn,64.0),0.0);
	vec3 timing = (1.1*time)*vec3(0.0,-1.7,1.1) + flow;
	vec3 displacePos = vec3(1.0,0.5,1.0)*2.4*position+(1.1*time)*vec3(0.01,-0.7,1.3);
	vec3 displace3 = vec3(noiseStackUV(displacePos,2,0.4,0.1),0.0);
	vec3 noiseCoord = (vec3(2.0,1.0,1.0)*position+timing+0.4*displace3)/1.0;
	float noise = noiseStack(noiseCoord,3,0.4);
	float flames = pow((min((gl_FragCoord.y/1210.0),1.0)),0.2*(1.0-abs(2.0*(gl_FragCoord.x/resolution.x)-1.0)))*pow(noise,(1.0-abs(2.0*(gl_FragCoord.x/resolution.x)-1.0)));
	float f = ypartClippedFalloff*pow(1.0-flames*flames*flames,8.0);
	vec3 fire = 1.5*vec3(f, (f*f*f), (f*f*f)*(f*f*f));
	float smokeNoise = 0.5+snoise(0.4*position+timing*vec3(1.0,1.0,0.2))/2.0;
	vec3 smoke = vec3(0.3*pow((1.0-abs(2.0*(gl_FragCoord.x/resolution.x)-1.0)),3.0)*pow((gl_FragCoord.y/resolution.y),2.0)*(smokeNoise+0.4*(1.0-noise)));
	vec2 sparkCoord = gl_FragCoord.xy - vec2(2.0*0.0,190.0*(1.1*time));
	sparkCoord -= 30.0*noiseStackUV(0.01*vec3(sparkCoord,30.0*time),1,0.4,0.1);
	sparkCoord += 100.0*flow.xy;
	if (mod(sparkCoord.y/30.0,2.0)<1.0) sparkCoord.x += 0.5*30.0;
	vec2 sparkGridIndex = vec2(floor(sparkCoord/30.0));
	float sparkRandom = prng(sparkGridIndex);
	float sparkLife = min(10.0*(1.0-min((sparkGridIndex.y+(190.0*(1.1*time)/30.0))/(24.0-20.0*sparkRandom),1.0)),1.0);
	vec3 sparks = vec3(0.0);
	if (sparkLife>0.0) {
		float sparkSize = (1.0-abs(2.0*(gl_FragCoord.x/resolution.x)-1.0))*(1.0-abs(2.0*(gl_FragCoord.x/resolution.x)-1.0))*sparkRandom*0.08;
		float sparkRadians = 999.0*sparkRandom*2.0*3.1415926535897932384626433832795 + 2.0*time;
		vec2 sparkCircular = vec2(sin(sparkRadians),cos(sparkRadians));
		vec2 sparkOffset = (0.5-sparkSize)*30.0*sparkCircular;
		vec2 sparkModulus = mod(sparkCoord+sparkOffset,30.0) - 0.5*vec2(30.0);
		float sparkLength = length(sparkModulus);
		float sparksGray = max(0.0, 1.0 - sparkLength/(sparkSize*30.0));
		sparks = sparkLife*sparksGray*vec3(1.0,0.3,0.0);
	}
	gl_FragColor = vec4(max(fire,sparks)+smoke,1.0);
}