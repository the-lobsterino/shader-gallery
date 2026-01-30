/*
 * Original shader from: https://www.shadertoy.com/view/ssGyD3
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
#define RAYMARCHER_DEPTH 800

vec2 rmin(vec2 a, vec2 b) {
    return a[0] < b[0] ? a : b;
}

vec2 rmax(vec2 a, vec2 b) {
    return a[0] > b[0] ? a : b;
}

vec2 smin(vec2 a, vec2 b, float k) {
    float c = max(0.0, k - abs(a[0] - b[0]));
    
    return a[0] < b[0] ? vec2(a[0] - (c*c / (k*4.0)), a[1]) : vec2(b[0] - (c*c / (k*4.0)), b[1]);
}

float sdSphere(vec3 pos, vec3 cen, float r) {
    return length(pos - cen) - r;
}

float noise(vec3 pos, float time) {
    return 1.0 - fract((pos.x+pos.y+pos.x+time) * 1337.0) / 100000.0;
    //return 0.0;
}

float sdGnd(vec3 pos, float time) {
    //float waves = 0.5 * sin(0.5 * pos.x + time) * sin(-0.1*pos.z + time) * sin(time);
    //waves += 0.3 * sin(0.6 * pos.x + time) * sin(0.3*pos.z + time) * (1.0+sin(time));
    //waves += 0.3 * sin(1.6 * pos.x + time) * sin(1.3*pos.z + time) * (1.0+sin(time));
    
    //waves += (0.0054 * sin(23.0*pos.z + 6.0*time)*sin(20.2*pos.x + 6.0*time)) * sin(time);
    //waves += (0.0074 * sin(24.4*pos.z + 12.3*time)*sin(0.5 + 24.6*pos.x + 12.3*time)) * sin(time);
    
    //float waves = (0.2 * sin(pos.x + time) * sin(pos.z));
    //waves += 0.1 * sin(0.5*time) * sin(2.0*(pos.x + time));
    //waves += 0.2 * sin(1.0*time) * sin(1.0*(pos.x + time));
    //waves += (0.3 * sin(pos.z + time) * sin(pos.x + pos.z +  time * 3.0));
    //waves += (0.0094 * sin(4.0*pos.z + time)*sin(8.0*pos.x + time));
    //waves += (0.004 * sin(16.0*pos.z + time)*sin(16.0*pos.x + time));
    
    float waves = 0.0;
    
    float a = 0.65 * cos(time / 10.0);
    float a_f = 0.25;
    float t_f = 0.9;
    float x_mul = 1.36;
    float t_mul = 1.4;
    float x_a_mul = 0.58;

    float dir_x = 1.0;
    float dir_z = 1.0;
    
    for(int i=0;i<10;++i) {
        dir_x = sin(float(i)*0.5) ;
        dir_z = cos(float(i)*0.5)  ;
        waves += a*sin(a_f*pos.x*dir_x + t_f * time) + a*sin(a_f*pos.z*dir_z + t_f * time);//+ 0.001*sin(noise(pos, time*float(i)));
        
        a_f *= x_mul;
        t_f *= t_mul;
        a *= x_a_mul;
    }    
    
    //dir_x = sin(2.0);
    //dir_z = cos(2.0);
    //t_f=2.0;
    //waves += 0.001*sin(10.0*pos.x*dir_x + t_f * time) + 0.002*sin(10.0*pos.z*dir_z + t_f * time); //+ a*noise(pos, time*float(i));

    //dir_x = sin(4.0);
    //dir_z = cos(4.0);
    //waves += 0.002*sin(10.0*pos.x*dir_x + t_f * time) + 0.001*sin(10.0*pos.z*dir_z + t_f * time); //+ a*noise(pos, time*float(i));
    
    return  waves;
}

vec2 map(vec3 pos, float time, vec3 boatPosF, vec3 boatPosB) {
    float z = -0.5*time;
    vec2 res = vec2(20.0, 0.0);
    
    vec2 d = vec2(sdSphere(pos, boatPosF, 0.2), 2.0);
    vec2 d2 = vec2(sdSphere(pos, boatPosB, 0.2), 2.0);
    
    vec2 d3 = vec2(sdSphere(pos, boatPosF + vec3(-0.3,0.3,0.0), 0.1), 3.0);
    vec2 d4 = vec2(sdSphere(pos, boatPosF + vec3(0.3,0.3,0.0), 0.1), 4.0);
    vec2 d5 = vec2(sdSphere(pos, boatPosB + vec3(0.0,0.3,0.0), 0.1), 5.0);
    
    //vec2 d6 = vec2(sdSphere(pos, boatPosF + vec3(5.3,0.9,20.0), 0.7), 3.0);
    
    vec2 gnd = vec2(sdGnd(pos, time) + pos.y + 0.1, 1.0);
    
    res = rmin(res, d);
    res = smin(res, d2, 1.5);
    res = rmin(res, d3);
    res = rmin(res, d4);
    res = rmin(res, d5);
    //res = rmin(res, d6);
    res = rmin(gnd, res);
    
    return res;
}

vec3 calcNormal(vec3 pos, float time, vec3 boatPosF, vec3 boatPosB) {
    float eps = 0.01;
    
    return normalize(vec3(
        map(vec3(pos.x - eps, pos.y, pos.z), time, boatPosF, boatPosB)[0] - map(vec3(pos.x + eps, pos.y, pos.z), time, boatPosF, boatPosB)[0],
        map(vec3(pos.x, pos.y - eps, pos.z), time, boatPosF, boatPosB)[0] - map(vec3(pos.x, pos.y + eps, pos.z), time, boatPosF, boatPosB)[0],
        map(vec3(pos.x, pos.y, pos.z - eps), time, boatPosF, boatPosB)[0] - map(vec3(pos.x, pos.y, pos.z + eps), time, boatPosF, boatPosB)[0]
    ));

    //vec3 n = vec3(0.0);
    //for( int i=min(iFrame,0); i<4; i++ )
    //{
    //    vec3 e = 0.5773*(2.0*vec3((((i+3)>>1)&1),((i>>1)&1),(i&1))-1.0);
    //    n += e*map(pos+0.1*e,time, boatPosF, boatPosB).x;
    //}
    //return -normalize(n);
}

vec2 castRay(vec3 ro, vec3 rd, float time, vec3 boatPosF, vec3 boatPosB, int depth) {
    vec2 d = vec2(0.1, 0.0);
    
    for(int i=0;i<RAYMARCHER_DEPTH;++i) {
        vec2 h = map(ro + rd * d[0], time, boatPosF, boatPosB);
        d[0] += h[0];
        
        if(h[0] > 20.0) {
            return d;
        }
        
        if(h[0] < 0.0001) {
            d[1] = h[1];
            return d;
        }
    }
    
    if(rd.y < 0.0) {
        d[1] = 1.0;
    }
    
    return d;

}

vec3 get_sky(vec3 ray, float time) {
    vec2 mp = ray.xy - vec2(0.15,0.13);
    vec2 mp2 = ray.xy - vec2(0.08,0.13);
    vec3 mc = vec3(0.0);
    if(length(mp) < 0.07 && length(mp2) > 0.07 && ray.z > 0.0) {
        mc = vec3(0.6) * smoothstep(0.06,0.05, length(mp)) * smoothstep(0.07,0.08, length(mp2));
        //mc = vec3(2.5, 2.2, 1.2) * smoothstep(0.06,0.05, length(mp)) * smoothstep(0.07,0.08, length(mp2));
        
    }
    
    if(length(mp) < 0.20 && ray.z > 0.0) {
        mc += vec3(0.5) * smoothstep(0.20,0.00, length(mp));
        //mc += vec3(2.5, 2.2, 1.2)*0.6 * smoothstep(0.20,0.00, length(mp));
    }        
    
    vec3 sky = vec3(0.1, 0.25, 0.4) - 0.7 * ray.y;
    sky = mix(sky, vec3(0.3,0.35,0.4), exp(-10.0*ray.y));
    sky = mix(sky, mc, 0.5) * 2.0;
    return sky;
}

vec3 getMaterialColor(float m, vec3 pos) {
    vec3 mate = vec3(0.0);
    if(m < 1.5) {
        mate = vec3(0.00,0.04,0.07);
    } else if(m < 2.5) {
        mate = vec3(0.9,0.9,0.9);
    } else if(m < 3.5) {
        mate = vec3(0.0,1.0,0.0);
    } else if(m < 4.5) {
        mate = vec3(1.0,0.0,0.0);
    } else if(m < 5.5) {
        mate = vec3(1.0,1.0,0.7);
    }
    return mate;
}

void mainImage( out vec4 fragColor, in vec2 fragCoord )
{
    vec2 p = (2.0 * fragCoord - iResolution.xy) / iResolution.y;
    float time = iTime;

    //float an = iTime;
    float an = 10.0*iMouse.x / iResolution.x + 3.4;

    vec3 ta = vec3(-2.0,1.95,time*0.5-3.0);
    vec3 ro = ta + vec3(1.5*sin(an),0.4,1.5*cos(an));
    
    
    vec3 ww = normalize(ta - ro);
    vec3 uu = normalize(cross(ww, vec3(0,1,0)));
    vec3 vv = normalize(cross(uu, ww));
    
    vec3 rd = normalize(p.x*uu + p.y*vv + 1.8*ww);


    vec2 boatPos = vec2(1.0, time*0.5 );
    vec3 boatPosF = vec3(0.0,-sdGnd(vec3(0.0, boatPos.x, boatPos.y), time-0.2),boatPos.y);
    vec3 boatPosB = vec3(0.0,-sdGnd(vec3(0.0, boatPos.x, boatPos.y-0.9), time-0.2),boatPos.y-0.9);



    vec3 col = vec3(0.01,0.55,0.8);
    vec3 mate = vec3(0.0);
    vec3 sd = normalize(vec3(0.50,0.2,3.5));
    
    vec2 t = castRay(ro, rd, time, boatPosF, boatPosB, RAYMARCHER_DEPTH);    
    
    
    vec3 ls1 = boatPosF + vec3(-0.36,0.39,0.05);
    vec3 ls2 = boatPosF + vec3(0.36,0.39,0.05);
    vec3 ls3 = boatPosB + vec3(0.0,0.39,-0.05);
    
    
    vec3 pos = ro + rd * t[0];
    
    if(t[1] > 0.5) {        
        mate = getMaterialColor(t[1], pos);
    
        vec3 nor = calcNormal(pos, time, boatPosF, boatPosB);
    
        float s_dif = clamp(dot(-sd, nor), 0.0, 1.0);
        float c_dif = clamp(dot(vec3(0.0,-1.0,0.0), nor), 0.0, 1.0);
        
        float m_spe = clamp(dot(normalize(pos+rd),sd)*dot(-normalize( sd-rd ),nor),0.0,1.0);
        
        float s_sha = clamp(castRay(pos, sd, time, boatPosF, boatPosB, 50)[0], 0.0, 1.0);
        
        float ls1_d = castRay(pos, normalize(ls1 - pos), time, boatPosF, boatPosB, 50)[0];
        float ls1_dif = (ls1_d >= length(pos - ls1) && length(pos - ls1) > 0.0 ? 1.0 : 0.0) * exp(-1.6*length(pos - ls1))*clamp(dot(pos - ls1, nor),0.0,1.0)*4.0;
        
        float ls2_d = castRay(pos, normalize(ls2 - pos), time, boatPosF, boatPosB, 50)[0];
        float ls2_dif = (ls2_d >= length(pos - ls2) && length(pos - ls2) > 0.0 ? 1.0 : 0.0) * exp(-1.6*length(pos - ls2))*clamp(dot(pos - ls2, nor),0.0,1.0)*4.0;
        
        float ls3_d = castRay(pos, normalize(ls3 - pos), time, boatPosF, boatPosB, 50)[0];
        float ls3_dif = (ls3_d >= length(pos - ls3) && length(pos - ls3) > 0.0 ? 1.0 : 0.0) * exp(-1.6*length(pos - ls3))*clamp(dot(pos - ls3, nor),0.0,1.0)*4.0;       
        
        col = vec3(0.0);
        col += mate*vec3(2.0, 2.0, 2.0)*s_dif*s_sha*1.0;
        col += vec3(0.1, 0.25, 0.4)*c_dif*0.4;
        col += vec3(0.6)*m_spe*0.4;
        
        col += vec3(0.0, 0.95, 0.1)*ls1_dif;
        col += vec3(0.95, 0.0, 0.1)*ls2_dif;
        col += vec3(0.95, 0.9, 0.7)*ls3_dif;
        
        vec3 r = reflect(rd, nor);
        vec2 t2 = castRay(pos, r, time, boatPosF, boatPosB, 100);
        
        if(t2[1]> 0.5 ) {
            vec3 mate2 = getMaterialColor(t2[1], pos);
            if(t2[1] > 2.5) {
                col += mix(col, mate2, 0.7);
            } else {
                col+= mix(col, mate2, 0.05);
            }
        } else if(r.y > 0.0) {
            col += get_sky(r, time)*0.3;
        }

        col = mix( col, vec3(0.3,0.35,0.4), 1.0-exp( -0.0000001*t[0]*t[0]*t[0] ) );
        
    
    } else {
        col = get_sky(rd, time);
    }

    // Output to screen
    fragColor = vec4(col,1.0);
}
// --------[ Original ShaderToy ends here ]---------- //

void main(void)
{
    mainImage(gl_FragColor, gl_FragCoord.xy);
}