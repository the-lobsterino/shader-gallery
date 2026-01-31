#extension GL_OES_standard_derivatives : enable

precision highp float;

in vec2 fragPos;
out vec4 fragColor;

const vec2 shadowOffset = vec2(50,50);

void main( void ) {

    vec2 fragPosNormalized = ((fragPos + 1.0) / 2.0);
    vec2 shadowOffsetNormalized = shadowOffset / vec2(textureSize(theTexture, 0));

    vec4 color = texture(theTexture, fragPosNormalized / (1.0 - shadowOffsetNormalized));
    if (fragPosNormalized.x > shadowOffsetNormalized.x && fragPosNormalized.y > shadowOffsetNormalized.y)
    {
        // draw the shadow
        color = texture(theTexture, fragPosNormalized / shadowOffsetNormalized);
        color *= vec4(0.5, 0.5, 0.5, 1.0);
    }

    fragColor = color;

}