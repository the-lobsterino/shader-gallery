#ifdef GL_ES
precision highp float;
#endif

#extension GL_OES_standard_derivatives : enable

uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;

 void main( void)
        {
            vec2 p = ( gl_FragCoord.xy / resolution.x ) * 3.0 - 1.5;

            vec3 c = vec3( 0.0 );

            float amplitude = (sin(10.*time)+20.)/80.;
            float glowT = sin(time) * 0.5 + 0.5;
            float glowFactor = mix( 0.15, 0.25, glowT );

            c += vec3(0.1, 0.1, 0.2) - ( glowFactor *.1* abs( tan(time) / sin(p.x + sin( p.y + time ) * amplitude ) ));
            c += vec3(0.1, 0.2, 0.1) * ( glowFactor *.1* abs( sin(time+0.698) / sin(p.x + tan( p.y * time+0.698 ) * amplitude ) ));
            c += vec3(0.2, 0.1, 0.1) * ( glowFactor *.1* abs( sin(time+1.396) / sin(p.x + sin( p.y + time+1.396 ) - amplitude ) ));
            c += vec3(0.1, 0.1, 0.2) * ( glowFactor *.1* abs( tan(time+2.094) / sin(p.x + sin( p.y - time+2.094 ) - amplitude ) ));
            c += vec3(0.1, 0.2, 0.1) * ( glowFactor -.1* abs( sin(time+2.793) / cos(p.x + tan( p.y - time+2.793 ) - amplitude ) ));
            c += vec3(0.2, 0.1, 0.1) * ( glowFactor *.1* abs( cos(time+3.491) / sin(p.x + sin( p.y - time+3.491 ) - amplitude ) ));
            c += vec3(0.1, 0.1, 0.2) * ( glowFactor *.1* abs( sin(time+4.189) / tan(p.x + tan( p.y + time+4.189 ) - amplitude ) ));
            c += vec3(0.1, 0.2, 0.1) * ( glowFactor *.1* abs( sin(time+4.887) / sin(p.x + sin( p.y + time+4.887 ) - amplitude ) ));
            c += vec3(0.2, 0.1, 0.1) * ( glowFactor *.1* abs( tan(time+5.585) / cos(p.x + sin( p.y + time+5.585 ) * amplitude ) ));

gl_FragColor = vec4( c+((sin(1.5*time)+1.)/20.), 1.0 );
	 }