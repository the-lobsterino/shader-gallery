/*
 * Original shader from: https://www.shadertoy.com/view/WscGRM
 */

#ifdef GL_ES
precision mediump float;
#endif

// glslsandbox uniforms
uniform float time;
uniform vec2 resolution;

// shadertoy emulation
float iTime = 0.;
#define iResolution resolution
const vec4 iMouse = vec4(0.);

// Protect glslsandbox uniform names
#define time        stemu_time

// --------[ Original ShaderToy begins here ]---------- //
/*
''''''''''''''''''''''''''''''''''''''''''''        Xenium 2019
'''@@@@''''''''''@@@'''''@@@@@@@@@@@@@@@@'''
'''@@@@'''''''''@@@@@'''@@@@@@@@@@@@@@@@@@''
''@@@@@@''''''''@@@@@'''@@@@@@@@@@@@@@@@@@''  code  klos
''@@@@@@''''''''@@@@@'''@@@@@@@@@@@@@@@@@@''        shx
''@@@@@@''''''''@@@@@'''@@@@@@@@@@@@@@@@@@''        
''@@@@@@''''''''@@@@@''''''''''''''''@@@@@''
''@@@@@@''''''''@@@@@''''''''''''''''@@@@@''  music shx
''@@@@@@''''''''@@@@@''''''''''''''''@@@@@''  
''@@@@@@'''@@@@@@@@@@''''@@@@@@@@@@@@@@@@@''
''@@@@@@'''@@@@@@@@@@'''@@@@@@@@@@@@@@@@@@''  gfx   klos
''@@@@@@''@@@@@@@@@@@'''@@@@@@@@@@@@@@@@@@''  
''@@@@@@''@@@@@@@@@@@'''@@@@@@@@@@@@@@@@@@''
'''@@@@''''@@@@@@@@@''''@@@@@@@@@@@@@@@@@@''  >>> Hutger Rauer <<<
''''''''''''''''''''''''''''''''''''''''''''  
''''''''''''''''''''''''''''''''''''''''''''
'''@@@@''''@@@@@@@@@'''''@@@@@@@@@@@@@@@@'''
'''@@@@''''@@@@@@@@@@'''@@@@@@@@@@@@@@@@@@''  tools .crinkler
''@@@@@@''@@@@@@@@@@@'''@@@@@@@@@@@@@@@@@@''        .4klang
''@@@@@@''@@@@@@@@@@@'''@@@@@@@@@@@@@@@@@@''        .opengl
''@@@@@@'''@@@@@@@@@@'''@@@@@@@@@@@@@@@@@@''        .k2yasm
''@@@@@@''''''''@@@@@'''@@@@@'''''''''''''''
''@@@@@@''''''''@@@@@'''@@@@@'''''''''''''''  greets
''@@@@@@''''''''@@@@@'''@@@@@'''''''''''''''    Aberration Creations,
''@@@@@@''''''''@@@@@'''@@@@@@@@@@@@@@@@@'''    Abyss, Adapt, Alcatraz,
''@@@@@@''''''''@@@@@'''@@@@@@@@@@@@@@@@@@''    Altair, Brain Control,
''@@@@@@''''''''@@@@@'''@@@@@@@@@@@@@@@@@@''    Dekadence, Desire, FHI,
''@@@@@@''''''''@@@@@'''@@@@@@@@@@@@@@@@@@''    Fulcrum, Hprg, LJ, Nuance,
'''@@@@'''''''''@@@@''''@@@@@@@@@@@@@@@@@@''    PVM, Rabenauge, Skyrunner,
''''''''''''''''''''''''''''''''''''''''''''	Titan & everybody we forgot!
*/

// #define v iChannelTime[0]
#define v mod(iTime, 109.)
#define l iResolution

#define PI 3.1415
#define F gl_FragCoord
#define O (0)
#define N normalize
#define M(v)smoothstep(0.,1.,v)
#define C(v)clamp(v,0.,1.)

    int tid = -1;

    float gOpen	= 1.,
          gTime	= 0.,
          tdiff = 0.,
          tt	= 10e8;

    vec3  r			  	= vec3(  1, -1, 0  ),
          gBoundsPos  	= vec3(  0, .9, 0  ),
          gBoundsSize 	= vec3( 60,  2, 2.5),
          LINE_COLOR  	= vec3( 1.2, .3, .1);

    vec2 // R			= vec2(1920, 1080),
         gBloom		= vec2(10e8);

    mat2 rot(float a)
    {
        float s = sin(a),
          c = cos(a);
        return mat2(c, s, -s, c);
    }

    float impulse(float k)
    {
        return k * exp(1. - k);
    }

    float hash(vec2 p)
    {
        return fract(sin(dot(p, vec2(12.9898, 78.233))) * 43758.5453123);
    }

    float noise(vec2 p)
    {
        vec2 i = floor(p);
        vec2 f = fract(p); 
        vec2 u = f * f * (3. - 2. * f);

        float a = hash(i), 
              b = hash(i + r.xz),
              c = hash(i + r.zx),
              d = hash(i + r.xx);  

        return mix(a, b, u.x) +
                (c - a) * u.y * (1. - u.x) +
                (d - b) * u.x * u.y;
    }

    float fbm(vec2 x)
    {
        return + .5   * noise(     x)
               + .25  * noise(2. * x)
               + .125 * noise(4. * x);
    }

    float smin(float a, float b, float k)
    {
        float h = C(.5+.5*(b - a) / k);
        return mix(b, a, h) - k * h * (1. - h);
    }

    float insideBox3D(vec3 p, vec3 center, vec3 size)
    {
        vec3 s = step(center - size, p) - step(center + size, p);
        return s.x * s.y * s.z;
    }

    float sdBox(vec3 p, vec3 b)
    {
        vec3 d = abs(p) - b;
        return length(max(d, 0.)) + min(max(d.x, max(d.y, d.z)), 0.);
    }

    float sdEll(vec3 p, vec3 r)
    {
        float k0 = length(p / r);
        return k0 * (k0 - 1.) / length(p / (r * r));
    }

    vec2 opU(vec2 d1, vec2 d2)
    {
        return d1.x < d2.x ? d1 : d2;
    }

    vec3 rotXY(vec3 p, float a)
    {
        p.xy *= rot(a);
        return p;
    }

    vec2 map(vec3 pos)
    {
        // car light
        vec3 pR = pos;
        pR.z = abs(abs(pR.z) - 0.3);
        gBloom.x = min(gBloom.x, length(pR - vec3(.87, 0.28, 0.05)) - .045);
        vec2 res = vec2(gBloom.x, 5);

        vec3 pC = pos;
        if (gTime < 9.) // gTStart
        {
            pC.x = mod(pC.x + 4.0, 8.0) - 4.0;
            pC.z = mod(pC.z + 1.0, 2.0) - 1.0;
            res = opU(res, vec2(sdEll(pC, vec3(1.2, .6, .6)), 4));
        }
        else
        {
            if (insideBox3D(pos, vec3(0, .5, 0), vec3(2.4, 1., 1.5)) > .5)
            {
                vec3 pW = pC;

                pW.xz = abs(pW.xz);
                pW -= vec3(.6, .15, .4);

                gBloom.y = min(gBloom.y, sdBox(pC - vec3(-0.9, 0.3, 0), vec3(0.1, 0.02, 0.3)) - 0.03);

                float sBody0 = smin(
                                max(
                                    sdEll(abs(pC - vec3(-0.2, 0.2, 0)), vec3(1.3, 0.3, 1.)),
                                    sdBox(pC - vec3(0, 0.2, 0), vec3(1.3, 0.08, 0.34)) - .1
                                ), mix(
                                    sdEll(rotXY(pC, 0.2) - vec3(-0.45, 0.3, 0), vec3(0.6, 0.2, 0.35)),
                                    sdBox(rotXY(pC, 0.2) - vec3(-0.45, 0.3, 0), vec3(0.6, 0.3, 0.35)) - .1,
                                    0.3) - 0.05,
                            0.04),
                    sWheels0 = max(length(pW.xy) - 0.16, abs(pW.z) - 0.11);

                res = opU( 
                        res,
                        opU(
                            vec2( max(-length(pW - .1 * r.zzx) + .12, sWheels0), 3),
                            vec2( max(
                                    max(
                                        max(
                                            max(
                                                -sWheels0 + .02,
                                                max(
                                                    sBody0 - .04, 
                                                    smin(sWheels0, sBody0, .17)
                                                )
                                            ),
                                        -rotXY(pC, .1 * PI).x - .85),
                                        -pC.y + .05
                                    ),
                                    -sdBox(pC -vec3(1, .28, 0), vec3(.15, .04, .4))
                                ),
                                4
                            )
                        )
                    );
            }

            // orb
            vec3 pB = pos - vec3(-12. * gTime + 666.48, 1, 0); // gTTunel
            pB.xz *= rot(8. * gTime);
            mat2 r2 = rot(.25 * PI);
            pB.yz *= r2;
            pB.xy *= r2;
            float box0 = sdBox(pB, vec3(.5));
            gBloom.y = min(gBloom.y, box0);

            // trail
            vec3 pT = pos - vec3(-.9, -.45, 0);
            pT.z = abs(pT.z);
            pT -= vec3(-.02, 0, .3 -.01 * cos( 2.*pT.x+28.*gTime ));
            gBloom.y = min(gBloom.y, sdBox(pT - vec3(-20, .75, -.05), vec3(20, .01, .06)));
            res = opU(res, vec2(gBloom.y, 4));
        }

        pos.x += 12. * gTime;
        // lanes
        vec3 pL = pos;
        pL.z = abs(pL.z);
        pL.x = mod(pL.x + 1.5, 3.) - 1.5;
        res = opU(res, vec2(
                min(sdBox(pL - vec3(0, -.095,  .7), vec3( .5, .1, .06)),
                    sdBox(pL - vec3(0, -.095, 2.1), vec3(1.5, .1, .06))),
                 6));

        // ground
        if (abs(pos.z) > 2.)
        {
            res = opU(res, vec2(
                        pos.y
                        - fbm(pos.xz     ) *  .2 * M((abs(pos.z) - 2.2) /  .4)
                        - fbm(pos.xz * .1) * 4.  * M((abs(pos.z) - 2.6) / 7.4) * M((gTime - 18.)/10.),
                        2));
        }

        return res;
    }

    vec2 iBox(vec3 ro, vec3 rd, vec3 rad)
    {
        vec3 m = 1. / rd,
          n = m * ro,
          k = abs(m) * rad,
          t1 = -n - k,
          t2 = -n + k;
        return vec2(max(max(t1.x, t1.y), t1.z),
                 min(min(t2.x, t2.y), t2.z));
    }

    vec2 castRay(vec3 ro, vec3 rd)
    {
        if (gOpen > .5)
            gBoundsSize.yz = vec2(4, 30);

        vec2 res = vec2(10e8, -1),
             tb = iBox(ro - gBoundsPos, rd, gBoundsSize),
             h;

        float tmin =  .1,
              tmax = 90.,
              tp1 = -ro.y / rd.y,
              t;

        // raytrace floor plane
        if (tp1 > 0.)
        {
            tmax = min(tmax, tp1);
            res = vec2(tp1, 0);
        }    

        // raymarch primitives   
        if (tb.x < tb.y && tb.y > 0. && tb.x < tmax)
        {
            t = tmin = max(tb.x, tmin);
            if (gOpen < .5)
                res = opU(res, vec2(tb.y, 1));

            for (int i = O; i < 128; i++)
            {
                if (t >= min(tb.y, tmax)) break;
                h = map(ro + rd * t);
                if (h.x < (.0001 * t))
                {
                    res = vec2(t, h.y);
                    break;
                }
                t += h.x;
            }
        }

        return res;
    }

    vec3 calcNormal(vec3 pos)
    { // http://iquilezles.org/www/articles/normalsSDF/normalsSDF.htm
       vec2 e = vec2(1, -1) * .002;
       return N(e.xyy * map(pos + e.xyy).x +
                e.yyx * map(pos + e.yyx).x +
                e.yxy * map(pos + e.yxy).x +
                e.xxx * map(pos + e.xxx).x);
    }

    vec3 sky(vec3 rd, vec3 ro)
    {    
        float angle = 1. - abs(atan(rd.z, rd.x) / 2. * PI);
        return mix(
                mix(
                        .1 * r.zzx * max(5. * rd.y + .3, 0.)								// bg
                            + (    .2 * M((angle - .9 )/.1 ) * (LINE_COLOR - .2)			// line glow
                                + 2.  * M((angle - .99)/.01) *  LINE_COLOR      )			// line
                                * (10. * max(0., rd.y)),									// line scale and bottom up gradient
                        vec3(0),															// distant mountains shape color
                        step(rd.y, .03 * fbm(-20. * rd.xz))								    // distant mountains shape
                    ) 
                    + .5 * pow(max(0., rd.y), 8.) * LINE_COLOR,								// dome light
                .01 * LINE_COLOR,
                step(rd.y, .07*fbm(-10.*rd.xz))
            );
    }

    int tids[26];
    const int time_length = 26;
    float time[time_length];
    const int scenes = 15;
    float rox[scenes];
    float roy[scenes];
    float roz[scenes];
    float tax[scenes];
    float roxm[scenes];
    float taxm[scenes];

void init_arrays(void) {
    tids[0] = 12;
    tids[1] = -1;
    tids[2] = 13;
    tids[3] = -1;
    tids[4] = 0;
    tids[5] = 1;
    tids[6] = 2;
    tids[7] = 3;
    tids[8] = 4;
    tids[9] = 5;
    tids[10] = 6;
    tids[11] = 7;
    tids[12] = 8;
    tids[13] = 0;
    tids[14] = 10;
    tids[15] = 11;
    tids[16] = 9;
    tids[17] = 4;
    tids[18] = 3;
    tids[19] = 14;
    tids[20] = 5;
    tids[21] = 6;
    tids[22] = 4;
    tids[23] = 3;
    tids[24] = 7;
    tids[25] = -1;

    time[0] = 3.0;
    time[1] = 5.0;
    time[2] = 6.0;
    time[3] = 7.0;
    time[4] = 9.0;
    time[5] = 11.0;
    time[6] = 16.0;
    time[7] = 21.85;
    time[8] = 26.0;
    time[9] = 27.0;
    time[10] =  27.9;
    time[11] = 32.0;
    time[12] = 40.0;
    time[13] = 54.0;
    time[14] =  54.5;
    time[15] = 55.0;
    time[16] = 55.5;
    time[17] = 66.0;
    time[18] = 67.0;
    time[19] = 74.0;
    time[20] = 82.0;
    time[21] = 83.0;
    time[22] = 90.0;
    time[23] = 91.0;
    time[24] = 96.0;
    time[25] = 106.;

    rox[0] = 2.0;
    rox[1] = 4.0;
    rox[2] = 1.2;
    rox[3] = -2.0;
    rox[4] = 20.0;
    rox[5] = 20.0;
    rox[6] =  2.5;
    rox[7] =  0.0;
    rox[8] = -7.0;
    rox[9] =  4.0;
    rox[10] =  12.0;
    rox[11] = 20.0;
    rox[12] = 30.0;
    rox[13] = 40.0;
    rox[14] = -2.0;

    roy[0] = 0.1;
    roy[1] = 0.2;
    roy[2] = 1.0;
    roy[3] = 1.2;
    roy[4] = 0.2;
    roy[5] = 2.2;
    roy[6] = 1.5;
    roy[7] =30.0;
    roy[8] = 1.5;
    roy[9] = 1.2;
    roy[10] =  0.2;
    roy[11] = 1.0;
    roy[12] = 1.0;
    roy[13] = 5.0;
    roy[14] = 1.2;

    roz[0] = -0.3;
    roz[1] = -0.1;
    roz[2] = -8.0;
    roz[3] = -1.5;
    roz[4] = -1.5;
    roz[5] = 0.7;
    roz[6] = 3.0;
    roz[7] = 2.0;
    roz[8] = 1.5;
    roz[9] = -3.5;
    roz[10] = -0.1;
    roz[11] = -6.0;
    roz[12] = -4.0;
    roz[13] = -0.3;
    roz[14] = 0.0;

    tax[0] = 20.0;
    tax[1] = 0.0;
    tax[2] = 1.7;
    tax[3] = 1.0;
    tax[4] = 0.0;
    tax[5] = 0.0;
    tax[6] = 0.7;
    tax[7] = 4.0;
    tax[8] = 5.0;
    tax[9] = 0.0;
    tax[10] = 0.0;
    tax[11] = 0.0;
    tax[12] = 30.0;
    tax[13] = 43.0;
    tax[14] = 1.0;

    roxm[0] = 0.0;
    roxm[1] = -0.2;
    roxm[2] = -0.2;
    roxm[3] = -0.5;
    roxm[4] = -50.0;
    roxm[5] = -50.0;
    roxm[6] = -0.1;
    roxm[7] = -8.0;
    roxm[8] = -0.5;
    roxm[9] = -0.05;
    roxm[10] = -25.0;
    roxm[11] = -50.0;
    roxm[12] = -25.0;
    roxm[13] = -30.0;
    roxm[14] = -0.3;

    taxm[0] = -5.0;
    taxm[1] = 0.0;
    taxm[2] = -0.3;
    taxm[3] = -0.2;
    taxm[4] = 0.0;
    taxm[5] = 0.0;
    taxm[6] = -0.1;
    taxm[7] = -1.0;
    taxm[8] = 0.5;
    taxm[9] = -0.05;
    taxm[10] = 0.0;
    taxm[11] = 0.0,
    taxm[12] = -25.0,
    taxm[13] = -30.2;
    taxm[14] = -0.1;
}

    // void main()
    void mainImage(out vec4 f, in vec2 fragCoord)
    {
        vec2 p = (-l.xy + 2. * F.xy) / l.y;
        vec2 q = F.xy / l.xy;
        vec2 res;

        if (abs(p.y) > 0.74) { f = vec4(0.,0.,0.,1.); return; }

        init_arrays();

        gTime = v + (hash(F.xy)*.04);
        gOpen = gTime > 55.5 && gTime < 91. ? 0.0 : 1.0; // gTTunel, gTEnd

        vec3 ta = vec3(0.,.1,0),
          ro, rom, tam,  col,  pos,  nor,  alb,  rad;
        ro = rom = tam = col = pos = nor = alb = rad = vec3(0);

        for (int ti = O; ti < time_length; ++ti)
        {
            if (gTime >= time[ti])
            {
                tdiff = gTime - time[ti];
                tid = tids[ti];
                for (int t = 0; t < scenes; ++t) {
                    if (t == tid)
                    {
                        ro = vec3(rox[t], roy[t], roz[t]);
                        ta.x = tax[t];
                        rom.x = roxm[t];
                        tam.x = taxm[t];
                    }
                }
            }
        }
        if (tid == -1) { f = vec4(0.,0.,0.,1.); return; }
        ro += rom * tdiff;
        ta += tam * tdiff;
        ro.y += 0.01 * hash(r.xx * 100. * gTime);
        p += 4.*dot(p,p)*(hash(F.xy+gTime))/l.xy;

        vec3 cw = N(ta - ro);
        vec3 cu = N(cross(cw, r.zxz));
        vec3 cv = cross(cu, cw);
        vec3 rd = mat3(cu, cv, cw) * N(vec3(p, 4));
        vec3 bg = sky(rd, ro);
        vec3 tint = vec3(1);
        vec3 pSpot = vec3(2, .5, 0);

        gBloom = r.xx*10e8;
        for (int bi = O; bi < 3; ++bi)
        {
            res = castRay(ro, rd);

            if (bi == 0)
            {
                tt = res.x;
            }

            if (res.y < .0)
            {
                col += sky(rd, ro) * tint;
                break;
            }

            pos = ro + res.x * rd;
            nor = (res.y < 1.5)
                ? (res.y < 0.5)
                    ? r.zxz
                    : vec3(0, N(gBoundsPos.yz - pos.yz))
                : calcNormal(pos);

            vec2 str0 = M( ( abs(fract(1.5*pos.yz+0.5)*2.-1.) -.1 ) /.02 );
            vec2 str1 = M( ( abs(fract(1.5*pos.yz+0.5)*2.-1.) -.05) /.05 );

            float fre = pow(dot(nor, rd) + 1., .2),
              ao = 1. 
                * exp2(min(0., map(pos + nor * .07).x / .07 - 1.))
                * exp2(min(0., map(pos + nor * .15).x / .15 - 1.))
                * exp2(min(0., map(pos + nor * .3 ).x / .3  - 1.)),
              imp = pow( impulse(10.*fract(.92*gTime)), 8.),
              frames1 = 1. - C( floor(2. * fract(.1 *(pos.x + 12.*gTime)) ) ),		// frames
              stripes0 = 1. - min(str0.x, str0.y),									// blinking stripes
              stripes1 = 1. - min(str1.x, str1.y);									// blinking stripes              

            alb = vec3(.1);
            if (res.y == 0.)
            {
                alb *= .1 * fbm((pos.xz + 12. * r.xz * gTime) * vec2(4, 80));
                fre *= .1;
            }

            rad = (ao
                 + 80.
                    * vec3(0, .5, 1)
                    * 1. / pow( length(pSpot - pos), 0.1)
                    * M( dot( N(pSpot - pos), -N(vec3(1, -5, 0)) ) -.1 / 1.5)
                  ) * alb;

            if (res.y == 1.0)
            {
                pos.yz *= rot(0.2*floor(5.0*gTime) * step(60.0, gTime));

                rad +=  2. -2.*C( floor(10.* fract(.05*(pos.x + 12.*gTime)) ) )
                        + 5. * frames1 * (  imp * stripes0 * step(60., gTime)
                                +                 stripes1 * step(70., gTime))
                        * mix(vec3(1), stripes1 * mix(LINE_COLOR.bgr, r.xzz, frames1), M( (gTime-75.) / 5.) );
            }

            if (res.y == 4.)        
                rad += LINE_COLOR * pow(max(0.,nor.y), 3.) * M( fbm(600.*pos.xz)*4.-2. );

            col += (1. - fre) * rad * tint;
            tint *= fre;

            rd = reflect(rd, nor);
            ro = pos + .001 * rd;
        }

        gBloom = .5 * exp(-gBloom * 10.);
        q *= 1. - q.yx;

        f = vec4(pow(												// gamma start
            (	
                mix(												// air red fog
                    mix(											// horizon blend blue fog
                        bg,
                        col
                        + LINE_COLOR.bgr * gBloom.x					// bloom red
                        + LINE_COLOR     * gBloom.y,				// bloom blue
                        exp(-.001 * tt * tt)
                    ),
                    LINE_COLOR,
                    .02 * (1. - exp(-.001 * tt * tt))
                )										
                + vec3(impulse(max(0., 10. * (gTime - 55.5) )))		// collision flash
                + vec3(impulse(max(0., 10. * (gTime - 91. ) )))		// tunnel leave flash
            )
             * pow(q.x * q.y * 15., .5),							// vignette
            vec3(.4545)), 1.);										// gamma end
    }
// --------[ Original ShaderToy ends here ]---------- //

#undef time

void main(void)
{
    iTime = time;
    mainImage(gl_FragColor, gl_FragCoord.xy);
}