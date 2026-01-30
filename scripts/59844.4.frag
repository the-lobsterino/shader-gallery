// mushroom cocks
#ifdef GL_ES
precision mediump float;
#endif

uniform float time;
//uniform vec2 mouse;
uniform vec2 resolution;

float PI=acos(-1.);
float speed=time*0.1375;

const float oid1=1.0;
const float oid2=2.0;
const float oid3=3.0;
const float oid4=4.0;
const float oid5=5.0;

mat3 m = mat3( 0.00,  0.80,  0.60, -0.80,  0.36, -0.48, -0.60, -0.48,  0.64 );

vec2 rotate(in vec2 k, in float t) {
	return vec2(cos(t)*k.x-sin(t)*k.y,sin(t)*k.x+cos(t)*k.y);
	}

vec2 opU( in vec2 d1, in vec2 d2 ) {
	return (d1.x<d2.x) ? d1 : d2;
	}

vec3 opCheapBend(in vec3 p, in float f ) {
    float c = cos(f*p.y);
    float s = sin(f*p.y);
    mat2  m = mat2(c,-s,s,c);
    return vec3(m*p.xy,p.z);
    }
vec2 map(in vec3 p ) {
	p.y -= length(p.xz)*0.3;
	
	p.x = mod(p.x,3.0)-0.5;
	p.z = mod(p.z,3.0)-1.5;
	vec3 tp=p;
	//top	
	vec3 c=vec3(0.9,0.3,1.5);
	vec2 ret =vec2(1000.0,0.0);
	vec2 h=vec2(0.47,1.3);
	vec3 t=vec3(-0.7,-1.3,0.0);
	float d=cos(2.2*p.y)*0.09;
	vec3 b =opCheapBend(p,-0.09);
	ret=opU(ret, vec2( max( length(b.xz+t.xz)-h.x-d, abs(b.y+t.y)-h.y )  ,oid2));	
	c=vec3(0.9,0.7,1.1);
	tp=p-vec3(1.54,3.4,0.0);
	tp.xy=rotate(tp.xy,0.4);
	d=-cos(6.2*tp.y)*0.05;
	b=opCheapBend(tp,-0.2);
	vec2 q = vec2( length(b.xz), tp.y );
	ret=opU(ret, vec2( max( max( dot(q,c.xy), b.y), -b.y-c.z )-d  ,oid1));	

	p.x -=0.7;
	//ret=opU(ret, vec2(length(max(abs(p)-vec3(442.0,0.0,2.0),0.0)), oid5));
        return ret;
	}


/***** textures *****/
float hash( float n ) {
    return fract(sin(n)*43758.5453);
	}

float noise( in vec3 x ){
    vec3 p = floor(x);
    vec3 f = fract(x);
    f = f*f*(3.0-2.0*f);
    float n = p.x + p.y*57.0 + 113.0*p.z;
    return mix(mix(mix( hash(n+  0.0), hash(n+  1.0),f.x),
                        mix( hash(n+ 57.0), hash(n+ 58.0),f.x),f.y),
                    mix(mix( hash(n+113.0), hash(n+114.0),f.x),
                        mix( hash(n+170.0), hash(n+171.0),f.x),f.y),f.z);
	}

float fbm( in vec3 p ) {
    float f = 0.0;
    f += 0.5000*noise( p ); p = m*p*2.02;
    f += 0.2500*noise( p ); p = m*p*2.03;
    f += 0.1250*noise( p ); p = m*p*2.01;
    f += 0.0625*noise( p );
    return f/0.9375;
	}

vec3 xtex( in vec3 pos, in vec3 nor, in vec3 color, out vec2 spe ) {
	spe=vec2(1.0);
	
	color *=0.7;

    float f = fbm( 4.0*sin(pos)*vec3(6.0,0.0,0.5) );
    color = mix( color, vec3(0.5,0.3,0.2), f );
    spe.y = 1.0 + 4.0*f;

    f = fbm( 2.0*pos );
	
    color *= 0.7+0.3*sin(f);

//  fake ao
//  f = smoothstep( 0.1, 1.55, length(pos.xz) );
//  color *= f*f*1.4;
    return color;		
	}

/***** textures *****/
			  
vec3 calcNormal(in vec3 p ) {
	vec3 e=vec3(0.001,0.0,0.0);
	return normalize(vec3( map(p+e.xyy).x - map(p-e.xyy).x, map(p+e.yxy).x - map(p-e.yxy).x, map(p+e.yyx).x - map(p-e.yyx).x ));
	}

vec2 intersect(in vec3 ro, in vec3 rd) {
	float t=0.0;
    for(int i=0; i<246; i++ ) {
        vec2 h = map(ro + rd*t);
        if( h.x<0.001 ) return vec2(t,h.y);
        t += h.x*0.75;
		}
    return vec2(0.0);
	}

float softshadow(in vec3 ro, in vec3 rd, in float mint, in float maxt, in float k ) {
    float res = 1.0;
    float dt = 0.1;
    float t = mint;
    for( int i=0; i<80; i++ ) {
        float h = map(ro + rd*t).x;
        if( h>0.001 )
            res = min( res, k*h/t );
        else
            res = 0.0;
        t += dt;
		}
    return res;
	}

void main(void)	{
	vec2 position=(gl_FragCoord.xy/resolution.xy);
	vec3 ray_direction=normalize( vec3( (-1.0+2.0*position)*vec2(1.0,1.0), 1.0));	// screen ratio (x,y) fov (z)
	vec3 ray_origin=vec3(0.0, 6.0, -8.0);											// camera position
	vec3 light=normalize(vec3(1.0, 1.0, -2.0)); 									// light position

	ray_origin.xz=rotate(ray_origin.xz, time*0.6);
	ray_direction.xz=rotate(ray_direction.xz, time*0.5);

	
	//raymarch
	vec2 t=intersect(ray_origin,ray_direction);  

	vec3 color = vec3(0.9,0.7,1.5)* (position.y-0.9*0.5);
		if (t.y>0.5) {
			//shading
			vec3 pos=ray_origin + ray_direction*t.x;
			vec3 nor=calcNormal(pos);
			vec3 ref = reflect(ray_direction,nor);
			
			float con = 1.0;
			float amb=0.5 + 0.5*nor.y;
			float dif=max(0.0, dot(nor,light));
			float bac = max(0.2 + 0.8*dot(nor,vec3(-light.x,light.y,-light.z)),0.0);
			
			float rim = pow(1.0+dot(nor,ray_direction),3.0);
			float spe = pow(clamp(dot(light,ref),0.0,1.0),16.0);
			
			//shadow
			float sh = 1.0;//softshadow( pos, light, 0.05, 9.0, 4.0 );
			
			//lights
			color  = 0.10*con*vec3(0.80,0.80,0.80);										//constant
        	color += 0.70*dif*vec3(1.00,0.97,0.85)*vec3(sh, (sh+sh*sh)*0.5, sh*sh );	//diffuse
        	color += 0.15*bac*vec3(1.00,0.97,0.85);									    //backlight
        	color += 0.20*amb*vec3(0.10,0.15,0.20);										//ambient
		
			//obj color
			vec2 pro;
			vec3 tc;
				if (t.y==oid1) tc=vec3(1.0,0.2,0.3);				
				if (t.y==oid2) tc=vec3(0.9,0.9,0.9);				
				if (t.y==oid3) tc=vec3(0.9,0.6,0.3);
				if (t.y==oid4) tc=vec3(0.5,1.0,1.0);
				if (t.y==oid5) tc=vec3(0.1,1.0,0.1);
			color*=xtex(pos,nor,tc,pro);
								
			//rim + spe
			color += 0.60*rim*vec3(1.0,0.97,0.85)*amb*amb;

			color += 0.60*pow(spe,pro.y)*vec3(1.0)*pro.x*sh;
			color = 0.3*color + 0.7*sqrt(color);
				float dis = t.x*t.x;
				color *= exp(-0.0001*dis);

			
		}
	
	color *= 0.25 + 0.75*pow( 16.0*position.x*position.y*(1.0-position.x)*(1.0-position.y), 0.15 );
	gl_FragColor=vec4( color, 0.7);
	}