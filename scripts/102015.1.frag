// Jasiel Guillen github.com/Darkensses

#extension GL_OES_standard_derivatives : enable

precision highp float;

uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;

void main( void ) {
	vec2 st = gl_FragCoord.xy / resolution;
        st *= 2.;    
        st.x += 0.5;
        st = fract(st);
        vec3 color = vec3(0.);

        vec3 colorClear = vec3(239./255., 230./255., 210./255.);
        vec3 colorDark = vec3(55./255., 40./255., 40./255.);
        vec3 colorMid = vec3(170./255., 148./255., 140./255.);

        float center = 0.5;
        float radius = 0.3;
        float dist = distance(vec2(center), st);
        float distTL = distance(vec2(0.,1.), st);
        float distTR = distance(vec2(1.,1.), st);
        float distBR = distance(vec2(1.,0.), st);
        float distBL = distance(vec2(0.,0.), st);

        float diamond = dot(abs(st-center), vec2(1.0, 1.));
        float diamondTL = dot(abs(st-vec2(0.,1.)), vec2(1.0, 0.4+abs(tan(time))*0.5));
        float diamondTR = dot(abs(st-vec2(1.,1.)), vec2(1.0, 0.4+abs(tan(time))*0.5));
        float diamondBR = dot(abs(st-vec2(1.,0.)), vec2(1.0, 0.4+abs(tan(time))*0.5));
        float diamondBL = dot(abs(st-vec2(0.,0.)), vec2(1.0, 0.4+abs(tan(time))*0.5));

        float half1 = step(diamond, 0.5) * step(radius, dist) * step(center, 1.-st.x);
        float half2 = step(diamond, 0.5) * step(radius, dist) * step(center, st.x);
        float halfTL = step(diamondTL, 0.5) * step(radius, distTL) * step(0., st.x);
        float halfTR = step(diamondTR, 0.5) * step(radius, distTR) * step(0., st.x);
        float halfBR = step(diamondBR, 0.5) * step(radius, distBR) * step(0., st.x);
        float halfBL = step(diamondBL, 0.5) * step(radius, distBL) * step(0., st.x);

        float semi1 = step(dist, radius) * step(center, 1.-st.x);
        float semi2 = step(dist, radius) * step(center, st.x);
    
    
        float semiTL = step(distTL, radius) * step(0., st.x);
        float semiTR = step(distTR, radius) * step(0., st.x);
        float semiBR = step(distBR, radius) * step(0., st.x);
        float semiBL = step(distBL, radius) * step(0., st.x);
    
        vec3 colorSlices = vec3(semiTL * colorDark) + vec3(halfTL * colorMid) + 
		           vec3(semiTR * colorClear) + vec3(halfTR * colorDark) +
		           vec3(semiBR * colorClear) + vec3(halfBR * colorDark) +
		           vec3(semiBL * colorDark) + vec3(halfBL * colorMid);

        color = vec3(half1 * colorDark) + vec3(half2 * colorMid) + vec3(semi1 * colorClear) + vec3(semi2 * colorDark);    
  
        gl_FragColor = vec4(colorSlices + color, 1.0);

}