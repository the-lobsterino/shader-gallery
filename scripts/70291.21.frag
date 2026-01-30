// dicks
#ifdef GL_ES
precision highp float;
#endif

// glslsandbox uniforms
uniform float time;
uniform vec2 resolution;

// shadertoy emulation
#define iTime time
#define iResolution resolution
#define PLANET_RADIUS 1.4
#define MAP_SCALE 2.0
#define MAP_ROUGHNESS 5.0
#define MAP_HEIGHT 0.35

vec3 Hash33(in vec3 p) {
    return vec3(fract(sin(dot(p, vec3(7643.54, 6854.95, 356.6765))) * 234.752),
                fract(sin(dot(p, vec3(7853.67, 5214.327, 435.6437))) * 6734.8275),
                fract(sin(dot(p, vec3(7546.754, 683.2647, 358.2431))) * 257.8643));
}

float noise(in vec3 p) {
    return fract(sin(dot(p, vec3(3743.54, 2754.23, 578.537))) * 5664.865);
}

float snoise(in vec3 p)
{

    vec3 cell = floor(p);
    vec3 local = fract(p);
    local *= local * (3.0 - 2.0 * local);

    float ldb = noise(cell);
    float rdb = noise(cell + vec3(1.0, 0.0, 0.0));
    float ldf = noise(cell + vec3(0.0, 0.0, 1.0));
    float rdf = noise(cell + vec3(1.0, 0.0, 1.0));
    float lub = noise(cell + vec3(0.0, 1.0, 0.0));
    float rub = noise(cell + vec3(1.0, 1.0, 0.0));
    float luf = noise(cell + vec3(0.0, 1.0, 1.0));
    float ruf = noise(cell + 1.0);

    return mix(mix(mix(ldb, rdb, local.x),
                   mix(lub, rub, local.x),
                   local.y),

               mix(mix(ldf, rdf, local.x),
                   mix(luf, ruf, local.x),
                   local.y),

               local.z);
}

float fnoise(in vec3 p) {

    p *= MAP_SCALE;

    float value = 0.0;
    float nscale = 1.0;
    float tscale = 0.0;

    for (float octave=0.0; octave < MAP_ROUGHNESS; octave++) {
        value += snoise(p) * nscale;
        tscale += nscale;
        nscale *= 0.5;
        p *= 2.0;
    }

	float nn = value / tscale;
	nn = clamp(nn,0.5,1.0);
	
	
	return nn;
	//return value / tscale;
}

vec3 map(in vec3 p)
{
	float n = fnoise(p);
	vec3 sea = vec3(0.25,0.55,0.95);
	vec3 lan1 = vec3(0.2, 1.1, 0.3);
	vec3 lan2 = vec3(1.1, 0.3, 0.3);
	vec3 color = mix(sea, mix(lan1, lan2, n ), float(n > 0.5));
	return color;
}
float smin( float a, float b, float k )
{
    float h = clamp( 0.5+0.5*(b-a)/k, 0.0, 1.0 );
    return mix( b, a, h ) - k*h*(1.0-h);
}
float sdTorus( vec3 p, vec2 t )
{
    return length( vec2(length(p.xz)-t.x,p.y) )-t.y;
}

float mapScene(in vec3 p)
{
	float earth = length(p) - PLANET_RADIUS;
	float off = fnoise(p) * MAP_HEIGHT;
	
	float d1 = sdTorus(p,vec2(2.0,0.0155));
	float d2 = sdTorus(p.yxz,vec2(2.0,0.0155));
	float d3 = sdTorus(p.yzx,vec2(2.0,0.0155));
	d1 = smin(d1,d2,0.1);
	d1 = smin(d1,d3,0.1);

	float d4 = p.y +1.7+sin(p.x*0.7+fract(time*0.4)*6.28+length(p))*0.17;
	
	d1 = smin(d1,d4,0.3);
	
	earth = smin(earth,d1,0.15);
	earth-=off;
	
	
	
	return earth*0.7;
}


vec3 getNormal( in vec3 pos )
{
    vec2 e = vec2(1.0,-1.0)*0.5773;
    const float eps = 0.001;
    return normalize( e.xyy*mapScene( pos + e.xyy*eps ) + 
					  e.yyx*mapScene( pos + e.yyx*eps ) + 
					  e.yxy*mapScene( pos + e.yxy*eps ) + 
					  e.xxx*mapScene( pos + e.xxx*eps ) );
}


void mainImage(out vec4 fragColor, in vec2 fragCoord) {
    vec2 uv = (fragCoord - 0.5 * iResolution.xy) / iResolution.y;
    fragColor = vec4(0.0, 0.0, 0.0, 1.0);
	float vv1=uv.y+0.2*4.0;
	fragColor.rgb = vec3(0.03,0.2,0.06)*vv1;

    vec3 ro = vec3(0., 0.2, 10.0+sin(time*0.7)*4.0);
    vec3 rd = normalize(vec3(uv, -1.5));
            vec3 l = vec3(-.74, .9, .0);
	l = normalize(l);

    float t = 0.0;
    for (float iters=0.0; iters < 200.0; iters++) {
        vec3 p = ro + rd * t;

        vec2 cs = sin(iTime + vec2(1.57, 0.0));
        p.xz *= mat2(cs, -cs.y, cs.x);
        //p.yz *= mat2(cs, -cs.y, cs.x);

        float d = mapScene(p);
        if (d < 0.001) {
            vec3 n = getNormal(p);

            //n.yz *= mat2(cs.x, -cs.y, cs.yx);
            n.xz *= mat2(cs.x, -cs.y, cs.yx);

            fragColor.rgb += map(p);
		float ddd = max(0.3, dot(n, l));
            fragColor.rgb *=ddd;
		
  	vec3 ref = reflect(rd, n);
	float spe = max(dot(ref, l), 0.0);
		
		fragColor.rgb += pow(spe,8.0)*0.7;
		
            break;
        }

        if (t > 20.0) {
            break;
        }

        t += d;
    }
}
// --------[ Original ShaderToy ends here ]---------- //

void main(void)
{
    mainImage(gl_FragColor, gl_FragCoord.xy);
    gl_FragColor.a = 1.0;	
}