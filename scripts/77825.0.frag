precision mediump float;

uniform vec2 resolution;

void main( void ) {

    vec2 position = ( gl_FragCoord.xy / resolution ) +vec2(0,0) / 4.0;
	vec2 size = vec2(1,100)/resolution;
                   // x1  y1   x2   y2
    vec4 rect = vec4(0, 0,  size.x, size.y);
    vec2 hv = step(rect.xy, position) * step(position, rect.zw);
    float onOff = hv.x * hv.y;

    gl_FragColor = mix(vec4(0,0,0,0), vec4(1,0,0,0), onOff);

}