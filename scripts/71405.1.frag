#ifdef GL_ES
precision mediump float;
#endif

#extension GL_OES_standard_derivatives : enable

uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;

vec2 rotate(vec2 samplePosition, float rotation){
    float angle = rotation *0.017453292;
    float sine = sin(angle); float cosine = cos(angle);
    return vec2(cosine * samplePosition.x + sine * samplePosition.y, cosine * samplePosition.y - sine * samplePosition.x);
}

vec2 translate(vec2 samplePosition, vec2 offset){
    return samplePosition - offset;
}

vec2 scale(vec2 samplePosition, float scale){
    return samplePosition / scale;
}

float circle(vec2 samplePosition, float radius){
    return length(samplePosition) - radius;
}

float rectangle(vec2 samplePosition, vec2 halfSize){
    vec2 componentWiseEdgeDistance = abs(samplePosition) - halfSize;
    float outsideDistance = length(max(componentWiseEdgeDistance, 0.0));
    float insideDistance = min(max(componentWiseEdgeDistance.x, componentWiseEdgeDistance.y), 0.0);
    return outsideDistance + insideDistance;
}

void main( void ) {
    vec2 pos = translate(gl_FragCoord.xy,vec2(32.0,resolution.y-32.0));
    pos = rotate(pos,45.0);
    float dist = rectangle(pos,vec2(16.0,16.0));
    vec3 col;
    if(dist < 0.005)
        col = vec3(1.0, 0.0, 0.0);
    else
        col = vec3(1.0, 1.0, 0.0);

    gl_FragColor = vec4(col,1.0);

}

