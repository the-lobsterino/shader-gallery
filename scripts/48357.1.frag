#ifdef GL_ES
precision mediump float;
#endif

#extension GL_OES_standard_derivatives : enable

uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;
float oct(float p){
    return fract(4768.1232345456 * sin(p));
}
float oct(vec2 p){
    return fract(4768.1232345456 * sin((p.x+p.y*43.0)));
}
float oct(vec3 p){
    return fract(4768.1232345456 * sin((p.x+p.y*43.0+p.z*137.0)));
}
float oct(vec4 p){
    return fract(4768.1232345456 * sin((p.x+p.y*43.0+p.z*137.0+p.w*2666.0)));
}

float achnoise(float x){
    float p = floor(x);
    float fr = fract(x);
    float L = p;
    float R = p + 1.0;

    float Lo = oct(L);
    float Ro = oct(R);

    return mix(Lo, Ro, fr);
}

float achnoise(vec2 x){
    vec2 p = floor(x);
    vec2 fr = fract(x);
    vec2 LB = p;
    vec2 LT = p + vec2(0.0, 1.0);
    vec2 RB = p + vec2(1.0, 0.0);
    vec2 RT = p + vec2(1.0, 1.0);

    float LBo = oct(LB);
    float RBo = oct(RB);
    float LTo = oct(LT);
    float RTo = oct(RT);

    float noise1d1 = mix(LBo, RBo, fr.x);
    float noise1d2 = mix(LTo, RTo, fr.x);

    float noise2d = mix(noise1d1, noise1d2, fr.y);

    return noise2d;
}
float achnoise(vec3 x){
    vec3 p = floor(x);
    vec3 fr = fract(x);
    vec3 LBZ = p + vec3(0.0, 0.0, 0.0);
    vec3 LTZ = p + vec3(0.0, 1.0, 0.0);
    vec3 RBZ = p + vec3(1.0, 0.0, 0.0);
    vec3 RTZ = p + vec3(1.0, 1.0, 0.0);

    vec3 LBF = p + vec3(0.0, 0.0, 1.0);
    vec3 LTF = p + vec3(0.0, 1.0, 1.0);
    vec3 RBF = p + vec3(1.0, 0.0, 1.0);
    vec3 RTF = p + vec3(1.0, 1.0, 1.0);

    float l0candidate1 = oct(LBZ);
    float l0candidate2 = oct(RBZ);
    float l0candidate3 = oct(LTZ);
    float l0candidate4 = oct(RTZ);

    float l0candidate5 = oct(LBF);
    float l0candidate6 = oct(RBF);
    float l0candidate7 = oct(LTF);
    float l0candidate8 = oct(RTF);

    float l1candidate1 = mix(l0candidate1, l0candidate2, fr[0]);
    float l1candidate2 = mix(l0candidate3, l0candidate4, fr[0]);
    float l1candidate3 = mix(l0candidate5, l0candidate6, fr[0]);
    float l1candidate4 = mix(l0candidate7, l0candidate8, fr[0]);


    float l2candidate1 = mix(l1candidate1, l1candidate2, fr[1]);
    float l2candidate2 = mix(l1candidate3, l1candidate4, fr[1]);


    float l3candidate1 = mix(l2candidate1, l2candidate2, fr[2]);

    return l3candidate1;
}


float achnoise(vec4 x){
    vec4 p = floor(x);
    vec4 fr = fract(x);
    vec4 LBZU = p + vec4(0.0, 0.0, 0.0, 0.0);
    vec4 LTZU = p + vec4(0.0, 1.0, 0.0, 0.0);
    vec4 RBZU = p + vec4(1.0, 0.0, 0.0, 0.0);
    vec4 RTZU = p + vec4(1.0, 1.0, 0.0, 0.0);

    vec4 LBFU = p + vec4(0.0, 0.0, 1.0, 0.0);
    vec4 LTFU = p + vec4(0.0, 1.0, 1.0, 0.0);
    vec4 RBFU = p + vec4(1.0, 0.0, 1.0, 0.0);
    vec4 RTFU = p + vec4(1.0, 1.0, 1.0, 0.0);

    vec4 LBZD = p + vec4(0.0, 0.0, 0.0, 1.0);
    vec4 LTZD = p + vec4(0.0, 1.0, 0.0, 1.0);
    vec4 RBZD = p + vec4(1.0, 0.0, 0.0, 1.0);
    vec4 RTZD = p + vec4(1.0, 1.0, 0.0, 1.0);

    vec4 LBFD = p + vec4(0.0, 0.0, 1.0, 1.0);
    vec4 LTFD = p + vec4(0.0, 1.0, 1.0, 1.0);
    vec4 RBFD = p + vec4(1.0, 0.0, 1.0, 1.0);
    vec4 RTFD = p + vec4(1.0, 1.0, 1.0, 1.0);

    float l0candidate1  = oct(LBZU);
    float l0candidate2  = oct(RBZU);
    float l0candidate3  = oct(LTZU);
    float l0candidate4  = oct(RTZU);

    float l0candidate5  = oct(LBFU);
    float l0candidate6  = oct(RBFU);
    float l0candidate7  = oct(LTFU);
    float l0candidate8  = oct(RTFU);

    float l0candidate9  = oct(LBZD);
    float l0candidate10 = oct(RBZD);
    float l0candidate11 = oct(LTZD);
    float l0candidate12 = oct(RTZD);

    float l0candidate13 = oct(LBFD);
    float l0candidate14 = oct(RBFD);
    float l0candidate15 = oct(LTFD);
    float l0candidate16 = oct(RTFD);

    float l1candidate1 = mix(l0candidate1, l0candidate2, fr[0]);
    float l1candidate2 = mix(l0candidate3, l0candidate4, fr[0]);
    float l1candidate3 = mix(l0candidate5, l0candidate6, fr[0]);
    float l1candidate4 = mix(l0candidate7, l0candidate8, fr[0]);
    float l1candidate5 = mix(l0candidate9, l0candidate10, fr[0]);
    float l1candidate6 = mix(l0candidate11, l0candidate12, fr[0]);
    float l1candidate7 = mix(l0candidate13, l0candidate14, fr[0]);
    float l1candidate8 = mix(l0candidate15, l0candidate16, fr[0]);


    float l2candidate1 = mix(l1candidate1, l1candidate2, fr[1]);
    float l2candidate2 = mix(l1candidate3, l1candidate4, fr[1]);
    float l2candidate3 = mix(l1candidate5, l1candidate6, fr[1]);
    float l2candidate4 = mix(l1candidate7, l1candidate8, fr[1]);


    float l3candidate1 = mix(l2candidate1, l2candidate2, fr[2]);
    float l3candidate2 = mix(l2candidate3, l2candidate4, fr[2]);

    float l4candidate1 = mix(l3candidate1, l3candidate2, fr[3]);

    return l4candidate1;
}
void main( void ) {

	vec2 position = ( gl_FragCoord.xy / resolution.xy ) * 100.0 + mouse / 4.0;

	float color = 0.0;
	color += sin( position.x * cos( time / 15.0 ) * 80.0 ) + cos( position.y * cos( time / 15.0 ) * 10.0 );
	color += sin( position.y * sin( time / 10.0 ) * 40.0 ) + cos( position.x * sin( time / 25.0 ) * 40.0 );
	color += sin( position.x * sin( time / 5.0 ) * 10.0 ) + sin( position.y * sin( time / 35.0 ) * 80.0 );
	color *= sin( time / 10.0 ) * 0.5;

	gl_FragColor = vec4( vec3(achnoise(vec3(position.x, position.y, time))), 1.0 );

}