#ifdef GL_ES
precision mediump float;
#endif

#extension GL_OES_standard_derivatives : enable

uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;

// p1とp2を通る直線より下の領域で1, 上の領域では0になる
float line(vec2 p, vec2 p1, vec2 p2){
    return step( (p.y - p1.y) * (p2.x - p1.x) , (p.x - p1.x) * (p2.y - p1.y));	
}

void main( void ) {
    vec2 p = ( gl_FragCoord.xy / resolution.xy );

    // 三角形の頂点
    vec2 p1 = vec2(0.2, 0.2);
    vec2 p2 = vec2(0.3, 0.6);
    vec2 p3 = vec2(0.5, 0.5);
		
    // p1とp2を通る直線より下の領域では1 それ以外では0
    float L12 = line(p,p1,p2);
	
    // p2とp3を通る直線より下の領域では1 それ以外では0
    float L23 = line(p,p2,p3);

    // p3とp1を通る直線より上の領域では1 それ以外では0
    float L31 = 1.0 - line(p,p1,p3);	
	
    // 三角形の内部では1 それ以外では0
    float color = L12 * L23 * L31;
	
    gl_FragColor = vec4(color);
}