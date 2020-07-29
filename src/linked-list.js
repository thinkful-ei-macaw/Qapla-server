class _Node {
  constructor(value, next = null) {
    this.value = value;
    this.next = next;
  }
}

class LinkedList {
  constructor() {
    this.head = null;
  }

  insertFirst(item) {
    this.head = new _Node(item, this.head);
  }

  insertLast(item) {
    if (this.head == null) {
      this.insertFirst(item);
    } else {
      let tempNode = this.head;
      while (tempNode.next !== null) {
        tempNode = tempNode.next;
      }

      tempNode.next = new _Node(item, null);
    }
  }

  insertAfter(item, newItem) {
    let currentNode = this.find(item);
    if (currentNode === null) return;

    currentNode.next = new _Node(newItem, currentNode.next);
  }

  insertAt(position, newItem) {
    let currentNode = this.head;
    let counter = 1;

    if (!this.head) this.insertFirst(newItem);

    while (counter < position) {
      if (currentNode.next == null) {
        return this.insertLast(newItem);
      }
      currentNode = currentNode.next;
      counter++;
    }
    
    this.insertAfter(currentNode.value, newItem);
  }

  find(item) {
    let currentNode = this.head;

    if(!this.head) {
      return null;
    }

    while (currentNode.value !== item) {
      if (currentNode.next === null) {
        return null;
      }
      else {
        currentNode = currentNode.next;
      }
    }
    return currentNode;
  }

  remove(item) {
    if (!this.head) {
      return null;
    }

    if (this.head.value === item) {
      this.head = this.head.next;
      return;
    }

    let currentNode = this.head;
    let previousNode = this.head;

    while ((currentNode !== null) && (currentNode.value !== item)) {
      previousNode = currentNode;
      currentNode = currentNode.next;
    }

    if (currentNode == null) return;
    previousNode.next = currentNode.next;
  }

}

module.exports = LinkedList;