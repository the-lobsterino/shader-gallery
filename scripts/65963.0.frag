#ifdef GL_ES
precision mediump float;
#endif 

uniform float time;
uniform vec2 resolution;

void main( void ) {

 vec2 u = 3.0 * (gl_FragCoord.xy * 2.0 - resolution) / min(resolution.x, resolution.y) ;
 
 
 float speed = 3.5;
 float speed2 = 2.5;
 
 vec2 o = vec2(sin(length(u) - time* speed),  cos( length(u) - time * speed));
 vec2 ux = u + vec2(1.4, 4.6);
 vec2 d = vec2(sin(length(ux) - time * speed), cos( length(ux) - time * speed));
 vec2 uy = u + vec2(-1.5, -1.8);
 vec2 l = vec2(sin(length(uy) - time / speed2), cos( length(uy) - time * speed2));
 vec2 uz = u + vec2(-2.0, 1.0 );
 vec2 r = vec2(sin(length(uz) - time / speed), cos(length(uz) - time * speed));
 vec2 ua = u + vec2(2.0, -1.0 );
 vec2 r2 = vec2(sin(length(ua) - time / speed), cos(length(ua) - time * speed));
 
 
 vec2 c = o / d / l * r - vec2(0.4, 0.8);
 float cx = o.y * d.y * r.x /  + l.y / r.x * ua.y;
 
 gl_FragColor = vec4( cx * 0.3, cx * 0.2 - 0.2, cx / 0.65, 1.0 );

}