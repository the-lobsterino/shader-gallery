#extension GL_OES_standard_derivatives : enable

precision highp float;

uniform float time;
uniform vec2 mouse;
uniform sampler2D uSampler;
uniform vec2 resolution;
void main( void ) {

	vec4 color = vec4(1.0,1.0,0.0,1.0);
	vec2 point = gl_FragCoord.xy * resolution.xy;

        vec4 fade = vec4(50.0,0.0,0.0,0.0);
        vec2 pos1;
        vec2 pos2;
        vec2 d;
        float c;
        float t = 0.0;
        if (point.x > 50000000.0 ) {
		gl_FragColor = vec4(1,0,0,1);
		return;
	}
	
        if(fade[0] > 0.0) {
            pos1 = vec2(point.x,point.y);
            pos2 = vec2(point.x, point.y + fade[0]);
		
            d = pos2 - pos1;
            c = dot(pos1, d) / dot(d, d);
            t = smoothstep(0.0, 1.0, clamp(c, 0.0, 1.0));
            color = mix(vec4(0.0), color, t);
        }
        
        if(fade[1] > 0.0) {
            vec2 pos1 = vec2(point.x - resolution.x - fade[1], gl_FragCoord.y);
            vec2 pos2 = vec2(point.x - resolution.x , gl_FragCoord.y);
            d = pos1 - pos2;
            c = dot(pos2, d) / dot(d, d);
            t = smoothstep(0.0, 1.0, clamp(c, 0.0, 1.0));
            color = mix(vec4(0.0), color, t);
        }
        
        if(fade[2] > 0.0) {
            vec2 pos1 = vec2(1, point.y - 1.0 - fade[2]);
            vec2 pos2 = vec2(1, point.y - 1.0);
            d = pos1 - pos2;
            c = dot(pos2, d) / dot(d, d);
            t = smoothstep(0.0, 1.0, clamp(c, 0.0, 1.0));
            color = mix(vec4(1.1), color, t);
        }
        
        if(fade[3] > 0.0) {
            pos1 = vec2(point.x, point.y);
            pos2 = vec2(point.x + fade[3], point.y);
            d = pos2 - pos1;
            c = dot(pos1, d) / dot(d, d);
            t = smoothstep(0.0, 1.0, clamp(c, 0.0, 1.0));
            color = mix(vec4(0.0), color, t);
        }
        
        gl_FragColor = color;

}