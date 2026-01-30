
precision highp float;
uniform vec2 resolution;
uniform sampler2D tex;
uniform int scalex;
uniform int scaley;

uniform int displayGPUversion;
uniform float ringDensity;
uniform float time;
uniform sampler2D in_texture;
vec4 pooltex;
vec3 waterTex,disp,test,bark;
vec2 p,DPmap;
float scale = 4.0;
float x,y,z;
vec4 result;





vec2 random2(vec2 st){
    st = vec2( dot(st,vec2(127.1,311.7)),
              dot(st,vec2(269.5,183.3)) );
    return -1.0 + 2.0*fract(sin(st)*43758.5453123);
}

// Gradient Noise by Inigo Quilez - iq/2013
// https://www.shadertoy.com/view/XdXGW8
float noise(vec2 st)
{
    vec2 i = floor(st);
    vec2 f = fract(st);

    vec2 u = f*f*(3.0-2.0*f);

    return mix( mix( dot( random2(i + vec2(0.0,0.0) ), f - vec2(0.0,0.0) ),
                     dot( random2(i + vec2(1.0,0.0) ), f - vec2(1.0,0.0) ), u.x),
                mix( dot( random2(i + vec2(0.0,1.0) ), f - vec2(0.0,1.0) ),
                     dot( random2(i + vec2(1.0,1.0) ), f - vec2(1.0,1.0) ), u.x), u.y);

}

// Modulo 289 without a division (only multiplications)
vec2 mod289(vec2 x) {
  return x - floor(x * (1.0 / 289.0)) * 289.0;
}

vec4 mod289(vec4 x) {
  return x - floor(x * (1.0 / 289.0)) * 289.0;
}

// Modulo 7 without a division
vec4 mod7(vec4 x) {

  return x - floor(x * (1.0 / 7.0)) * 7.0;
}
vec4 mod14(vec4 x) {
  return x - floor(x * (1.0 / 14.0)) * 14.0;
}

// Permutation polynomial: (34x^2 + x) mod 289
vec4 permute(vec4 x) {
  return mod289((34.0 * x + 1.0) * x);
}


vec3 hash3( vec2 p ) {
    vec3 q = vec3( dot(p,vec2(127.1,311.7)),
                   dot(p,vec2(269.5,183.3)),
                   dot(p,vec2(419.2,371.9)) );
    return fract(sin(q)*43758.5453);

}

float iqnoise( in vec2 x, float u, float v ){
    vec2 p = floor(x);
    vec2 f = fract(x);

    float k = 1.0+63.0*pow(1.0-v,4.0);

    float va = 0.0;
    float wt = 0.0;
    for (int j=-1; j<=1; j++)
	{
        for (int i=-1; i<=1; i++)
		{
            vec2 g = vec2(float(i),float(j));
            vec3 o = hash3(p + g)*vec3(u,u,1.0);
            vec2 r = g - f + o.xy;
            float d = dot(r,r);
            float ww = pow( 1.0-smoothstep(0.0,1.414,sqrt(d)), k );
            va += o.z*ww;
            wt += ww;
        }
    }

    return va/wt;

}



// Cellular noise ("Worley noise") in 3D in GLSL.
// Copyright (c) Stefan Gustavson 2011-04-19. All rights reserved.
// This code is released under the conditions of the MIT license.
// See LICENSE file for details.
// https://github.com/stegu/webgl-noise

// Modulo 289 without a division (only multiplications)
vec3 mod289(vec3 x) {
  return x - floor(x * (1.0 / 289.0)) * 289.0;
}

// Modulo 7 without a division
vec3 mod7(vec3 x) {
  return x - floor(x * (1.0 / 7.0)) * 7.0;
}

// Permutation polynomial: (34x^2 + x) mod 289
vec3 permute(vec3 x) {
  return mod289((34.0 * x + 1.0) * x);
}

// Cellular noise, returning F1 and F2 in a vec2.
// 3x3x3 search region for good F2 everywhere, but a lot
// slower than the 2x2x2 version.
// The code below is a bit scary even to its author,
// but it has at least half decent performance on a
// modern GPU. In any case, it beats any software
// implementation of Worley noise hands down.

vec2 cellular(vec3 P , float jitter) {
#define K 0.142857142857 // 1/7
#define Ko 0.428571428571 // 1/2-K/2
#define K2 0.020408163265306 // 1/(7*7)
#define Kz 0.166666666667 // 1/6
#define Kzo 0.416666666667 // 1/2-1/6*2


	vec3 Pi = mod289(floor(P));
 	vec3 Pf = fract(P) - 0.5;

	vec3 Pfx = Pf.x + vec3(1.0, 0.0, -1.0);
	vec3 Pfy = Pf.y + vec3(1.0, 0.0, -1.0);
	vec3 Pfz = Pf.z + vec3(1.0, 0.0, -1.0);

	vec3 p = permute(Pi.x + vec3(-1.0, 0.0, 1.0));

	vec3 p1 = permute(p + Pi.y - 1.0);
	vec3 p2 = permute(p + Pi.y);
	vec3 p3 = permute(p + Pi.y + 1.0);

	vec3 p11 = permute(p1 + Pi.z - 1.0);
	vec3 p12 = permute(p1 + Pi.z);
	vec3 p13 = permute(p1 + Pi.z + 1.0);

	vec3 p21 = permute(p2 + Pi.z - 1.0);
	vec3 p22 = permute(p2 + Pi.z);
	vec3 p23 = permute(p2 + Pi.z + 1.0);

	vec3 p31 = permute(p3 + Pi.z - 1.0);
	vec3 p32 = permute(p3 + Pi.z);
	vec3 p33 = permute(p3 + Pi.z + 1.0);

	vec3 ox11 = fract(p11*K) - Ko;
	vec3 oy11 = mod7(floor(p11*K))*K - Ko;
	vec3 oz11 = floor(p11*K2)*Kz - Kzo;

	vec3 ox12 = fract(p12*K) - Ko;
	vec3 oy12 = mod7(floor(p12*K))*K - Ko;
	vec3 oz12 = floor(p12*K2)*Kz - Kzo;

	vec3 ox13 = fract(p13*K) - Ko;
	vec3 oy13 = mod7(floor(p13*K))*K - Ko;
	vec3 oz13 = floor(p13*K2)*Kz - Kzo;

	vec3 ox21 = fract(p21*K) - Ko;
	vec3 oy21 = mod7(floor(p21*K))*K - Ko;
	vec3 oz21 = floor(p21*K2)*Kz - Kzo;

	vec3 ox22 = fract(p22*K) - Ko;
	vec3 oy22 = mod7(floor(p22*K))*K - Ko;
	vec3 oz22 = floor(p22*K2)*Kz - Kzo;

	vec3 ox23 = fract(p23*K) - Ko;
	vec3 oy23 = mod7(floor(p23*K))*K - Ko;
	vec3 oz23 = floor(p23*K2)*Kz - Kzo;

	vec3 ox31 = fract(p31*K) - Ko;
	vec3 oy31 = mod7(floor(p31*K))*K - Ko;
	vec3 oz31 = floor(p31*K2)*Kz - Kzo;

	vec3 ox32 = fract(p32*K) - Ko;
	vec3 oy32 = mod7(floor(p32*K))*K - Ko;
	vec3 oz32 = floor(p32*K2)*Kz - Kzo;

	vec3 ox33 = fract(p33*K) - Ko;
	vec3 oy33 = mod7(floor(p33*K))*K - Ko;
	vec3 oz33 = floor(p33*K2)*Kz - Kzo;

	vec3 dx11 = Pfx + jitter*ox11;
	vec3 dy11 = Pfy.x + jitter*oy11;
	vec3 dz11 = Pfz.x + jitter*oz11;

	vec3 dx12 = Pfx + jitter*ox12;
	vec3 dy12 = Pfy.x + jitter*oy12;
	vec3 dz12 = Pfz.y + jitter*oz12;

	vec3 dx13 = Pfx + jitter*ox13;
	vec3 dy13 = Pfy.x + jitter*oy13;
	vec3 dz13 = Pfz.z + jitter*oz13;

	vec3 dx21 = Pfx + jitter*ox21;
	vec3 dy21 = Pfy.y + jitter*oy21;
	vec3 dz21 = Pfz.x + jitter*oz21;

	vec3 dx22 = Pfx + jitter*ox22;
	vec3 dy22 = Pfy.y + jitter*oy22;
	vec3 dz22 = Pfz.y + jitter*oz22;

	vec3 dx23 = Pfx + jitter*ox23;
	vec3 dy23 = Pfy.y + jitter*oy23;
	vec3 dz23 = Pfz.z + jitter*oz23;

	vec3 dx31 = Pfx + jitter*ox31;
	vec3 dy31 = Pfy.z + jitter*oy31;
	vec3 dz31 = Pfz.x + jitter*oz31;

	vec3 dx32 = Pfx + jitter*ox32;
	vec3 dy32 = Pfy.z + jitter*oy32;
	vec3 dz32 = Pfz.y + jitter*oz32;

	vec3 dx33 = Pfx + jitter*ox33;
	vec3 dy33 = Pfy.z + jitter*oy33;
	vec3 dz33 = Pfz.z + jitter*oz33;

	vec3 d11 = dx11 * dx11 + dy11 * dy11 + dz11 * dz11;
	vec3 d12 = dx12 * dx12 + dy12 * dy12 + dz12 * dz12;
	vec3 d13 = dx13 * dx13 + dy13 * dy13 + dz13 * dz13;
	vec3 d21 = dx21 * dx21 + dy21 * dy21 + dz21 * dz21;
	vec3 d22 = dx22 * dx22 + dy22 * dy22 + dz22 * dz22;
	vec3 d23 = dx23 * dx23 + dy23 * dy23 + dz23 * dz23;
	vec3 d31 = dx31 * dx31 + dy31 * dy31 + dz31 * dz31;
	vec3 d32 = dx32 * dx32 + dy32 * dy32 + dz32 * dz32;
	vec3 d33 = dx33 * dx33 + dy33 * dy33 + dz33 * dz33;

	// Sort out the two smallest distances (F1, F2)
#if 0
	// Cheat and sort out only F1
	vec3 d1 = min(min(d11,d12), d13);
	vec3 d2 = min(min(d21,d22), d23);
	vec3 d3 = min(min(d31,d32), d33);
	vec3 d = min(min(d1,d2), d3);
	d.x = min(min(d.x,d.y),d.z);
	return vec2(sqrt(d.x)); // F1 duplicated, no F2 computed
#else
	// Do it right and sort out both F1 and F2
	vec3 d1a = min(d11, d12);
	d12 = max(d11, d12);
	d11 = min(d1a, d13); // Smallest now not in d12 or d13
	d13 = max(d1a, d13);
	d12 = min(d12, d13); // 2nd smallest now not in d13
	vec3 d2a = min(d21, d22);
	d22 = max(d21, d22);
	d21 = min(d2a, d23); // Smallest now not in d22 or d23
	d23 = max(d2a, d23);
	d22 = min(d22, d23); // 2nd smallest now not in d23
	vec3 d3a = min(d31, d32);
	d32 = max(d31, d32);
	d31 = min(d3a, d33); // Smallest now not in d32 or d33
	d33 = max(d3a, d33);
	d32 = min(d32, d33); // 2nd smallest now not in d33
	vec3 da = min(d11, d21);
	d21 = max(d11, d21);
	d11 = min(da, d31); // Smallest now in d11
	d31 = max(da, d31); // 2nd smallest now not in d31
	d11.xy = (d11.x < d11.y) ? d11.xy : d11.yx;
	d11.xz = (d11.x < d11.z) ? d11.xz : d11.zx; // d11.x now smallest
	d12 = min(d12, d21); // 2nd smallest now not in d21
	d12 = min(d12, d22); // nor in d22
	d12 = min(d12, d31); // nor in d31
	d12 = min(d12, d32); // nor in d32
	d11.yz = min(d11.yz,d12.xy); // nor in d12.yz
	d11.y = min(d11.y,d12.z); // Only two more to go
	d11.y = min(d11.y,d11.z); // Done! (Phew!)
	return sqrt(d11.xy); // F1, F2
#endif
}


float colorf1(vec3 xyz, float jitter) { return cellular(xyz,jitter).x * 2.0 - 1.0; }

float colorf2(vec3 xyz, float jitter) { return cellular(xyz,jitter).y * 2.0 - 1.0; }



vec3 water(vec2 p){
    float roundness = 2.0;
    vec2 test = p;
    test = p+noise(p+time/8.0)*roundness;

    float movement = time/2.0 +sqrt(test.x*test.x + test.y*test.y);

    vec3 xyz = vec3(p,movement);

    // här kan vi leka runt med olika sätt att göra vatten, rekommenderar F1
    float cell = colorf1(xyz, 0.9)/2.0;
    float cell2 = colorf1(xyz/2.0,0.9)/2.0;

    vec3 res = vec3(cell);
    vec3 cellDis = vec3(cell2);

    res = clamp(res,-0.1,0.7)+vec3(0.11,0.78,0.85)*0.8;
    res = res + cellDis/4.0;

    return res;

}

#define OCTAVES 2
float multiOct(vec2 coords){
   // Initial values
    float value = 0.0;
    float amplitude = .5;
    float frequency = 0.;
    // Loop of octaves
    for (int i = 0; i < OCTAVES; i++) {
        value = value + (amplitude * noise(coords));
        coords = coords*2.0;
        amplitude =amplitude* 0.5;
    }
    return value;


}



vec3 displaceDrip(vec2 coords){

    float perlin = multiOct(coords);
    vec3 res = vec3(abs(perlin));
    return res;

}

float adjContrast(float val, float threshold){
    if (val>= threshold){
        return val;
    }
    return 0.0;
}





//new try, making sure cellular is working correctly
vec3 waterTwo(vec2 xy){
    //vi start with getting the cellular correct, no color
    float z = 0.2;

    //giving some waves to the caustics
    xy = xy+noise(xy)*sin(time/3.0);


    //top layer, smooth and slow
    float topLayer = colorf1(vec3(xy.x,xy.y,time/6.0),1.0);


    //bottom layer, larger, faster
    float bottomLayer = colorf1(vec3(xy.x*0.5,xy.y*0.5,time*2.0+40.0),1.0);

    //working on fast flinging caustic irregular
    //still in progress, want random bursts of thin light
    float flingX = xy.x * (sin(time/2.0)*sin(time/8.0)+0.5);
    float flingY = xy.y * (cos(time/2.0+0.7)*cos(time/8.0+0.7)+0.5);

    float fastCaus = colorf1(vec3(flingX*0.5,flingY*0.5,time*2.0+40.0),1.0);

    vec3 bot = mix(0.0,0.4+0.3*bottomLayer,smoothstep(0.0,0.003,z))*vec3(1,1,1);
    vec3 top = mix(0.0,0.4+0.5*topLayer,smoothstep(0.0,0.003,z))*vec3(1,1,1);
    vec3 fastCaustic = mix(0.0,0.0+0.4*fastCaus,smoothstep(0.0,0.003,z))*vec3(1,1,1);
    vec3 background = vec3(0.11,0.78,0.85);

    //combine

    vec3 res = top*0.5+bot*0.1+ fastCaustic*abs(sin(time))*0.1;


    vec3 mapped = vec3(1.0) - exp(-res*7.0);

    mapped = pow(mapped,vec3(1.0/0.2));


    return res;
}

vec2 waterDispMap(vec2 xy){
    xy = xy+noise(xy)*sin(time/3.0);

    float topLayer = colorf1(vec3(xy.x,xy.y,time/6.0),1.0);
    vec3 top = mix(0.0,0.4+0.5*topLayer,smoothstep(0.0,0.003,0.2))*vec3(1,1,1);
    return top.xy;

}

//stolen from other sandbox creator https://glslsandbox.com/e#98161.0
// later modified by me 
vec4 poolFloor(vec2 pos){
	vec3 BRICK_COLOR = vec3(39.0 / 255.0, 199.0 / 255.0, 225.0 / 255.0);
	vec3 BRICK_COLOR_VARIATION = vec3( 30.0 /255.0, 20.0/255.0, 20.0/255.0);
	vec3 MORTAR_COLOR = vec3(255.0 / 255.0, 242.0 / 255.0, 236.0 / 255.0);
	vec2 BRICK_SIZE = vec2(0.035, 0.09);
	vec2 BRICK_PCT = vec2(0.95, 0.9);
	vec2 uv = pos/2.0;
    
    vec2 position = uv / BRICK_SIZE;
    
    if(fract(position.y * 0.05) > 0.5)
    {
     	position.x += 0.5;   
    }
    
    position = fract(position);
    
    vec2 useBrick = step(position, BRICK_PCT);
    
   
    vec3 color = mix(MORTAR_COLOR, BRICK_COLOR, useBrick.x * useBrick.y) + BRICK_COLOR_VARIATION ;

return vec4( vec3( color ), 1.0 );
}


vec4 waterResult(vec2 xy){
    p = xy*scale;
    p = p+displaceDrip(p).xy;

    disp = displaceDrip(p*scale);

    waterTex = water(p);
    test = waterTwo(xy*6.0);

    DPmap = xy*0.9+(waterDispMap(p))/50.0;
	
    //pooltex = texture(in_texture,DPmap);
	
	return vec4(test,1.0)+poolFloor(DPmap)*0.7;

    //return vec4(test,1.0);
}





vec4 barkResult(vec2 xy){
    xy = xy*3.14*2.0;

    x=(8.0+ 2.0*cos(xy.y))*cos(xy.x);
    y=(8.0+ 2.0*cos(xy.y))*sin(xy.x);
    z=2.0*sin(xy.y);

    float voronoi = colorf2(vec3(x,y,z)/3.0,1.0);


    bark = mix(0.0,0.4+0.5*voronoi,smoothstep(0.0,0.003,0.2))*vec3(0.83,0.44,0.19);

    return vec4 (vec3(bark-0.1),1.0);

}





void main(void)
{


    //out_Color = waterResult(texCoord);
   // out_Color = barkResult(texCoord);
	scale = 200.0;
	vec2 position = ( gl_FragCoord.xy / resolution.xy*scale );
	//gl_FragColor = barkResult(position);
	gl_FragColor = waterResult(position);

}