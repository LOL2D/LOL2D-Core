const VectorHelper = {
    getVectorWithRange(rootVector, targetVector, range) {
        let from = rootVector.copy();
        let to = p5.Vector.add(
            from,
            p5.Vector.sub(targetVector, from).setMag(range)
        );

        return {
            from,
            to,
        };
    },
};

export default VectorHelper;
